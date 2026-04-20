#!/usr/bin/env python3
"""
Clean large SQL dump files by removing a target column (default: Photo)
from INSERT statements, and optionally from CREATE TABLE definitions.

Designed for local use in VS Code / terminal so confidential data stays
on the user's machine.

Usage:
    python scripts/remove_photo_column_from_sql.py input.sql output.sql
    python scripts/remove_photo_column_from_sql.py input.sql output.sql --column Photo
    python scripts/remove_photo_column_from_sql.py input.sql output.sql --keep-create-table-column

Notes:
- Streams the input file line by line and accumulates only one SQL statement
  at a time, so it is suitable for very large .sql files.
- Handles common INSERT patterns, including multi-row VALUES.
- Tries to preserve original SQL formatting as much as practical.
"""

from __future__ import annotations

import argparse
import re
from typing import List, Optional


INSERT_RE = re.compile(
    r"^\s*INSERT\s+INTO\s+(.+?)\s*\((.*)\)\s*VALUES\s*(.*)\s*;\s*$",
    re.IGNORECASE | re.DOTALL,
)

CREATE_TABLE_START_RE = re.compile(
    r"^\s*CREATE\s+TABLE\b", re.IGNORECASE
)


def split_sql_csv(text: str) -> List[str]:
    """Split SQL comma-separated text, respecting quoted strings."""
    parts: List[str] = []
    buf: List[str] = []
    in_string = False
    i = 0

    while i < len(text):
        ch = text[i]

        if ch == "'":
            buf.append(ch)
            if in_string and i + 1 < len(text) and text[i + 1] == "'":
                buf.append(text[i + 1])
                i += 1
            else:
                in_string = not in_string
        elif ch == "," and not in_string:
            parts.append("".join(buf).strip())
            buf = []
        else:
            buf.append(ch)
        i += 1

    if buf:
        parts.append("".join(buf).strip())

    return parts


def split_top_level_rows(values_text: str) -> List[str]:
    """Split VALUES payload into row groups: (...), (...), (...)"""
    rows: List[str] = []
    buf: List[str] = []
    in_string = False
    depth = 0
    i = 0

    while i < len(values_text):
        ch = values_text[i]

        if ch == "'":
            buf.append(ch)
            if in_string and i + 1 < len(values_text) and values_text[i + 1] == "'":
                buf.append(values_text[i + 1])
                i += 1
            else:
                in_string = not in_string
        elif not in_string and ch == "(":
            depth += 1
            buf.append(ch)
        elif not in_string and ch == ")":
            depth -= 1
            buf.append(ch)
        elif not in_string and ch == "," and depth == 0:
            row = "".join(buf).strip()
            if row:
                rows.append(row)
            buf = []
        else:
            buf.append(ch)
        i += 1

    tail = "".join(buf).strip()
    if tail:
        rows.append(tail)

    return rows


def normalize_identifier(identifier: str) -> str:
    identifier = identifier.strip()
    if identifier.startswith('"') and identifier.endswith('"'):
        identifier = identifier[1:-1]
    elif identifier.startswith('`') and identifier.endswith('`'):
        identifier = identifier[1:-1]
    elif identifier.startswith('[') and identifier.endswith(']'):
        identifier = identifier[1:-1]
    return identifier.strip().lower()


def find_column_index(columns: List[str], target_column: str) -> Optional[int]:
    target = target_column.strip().lower()
    for idx, col in enumerate(columns):
        if normalize_identifier(col) == target:
            return idx
    return None


def process_insert_statement(statement: str, target_column: str) -> str:
    match = INSERT_RE.match(statement)
    if not match:
        return statement

    table_name, columns_raw, values_raw = match.groups()
    columns = split_sql_csv(columns_raw)
    target_idx = find_column_index(columns, target_column)

    if target_idx is None:
        return statement

    new_columns = columns[:target_idx] + columns[target_idx + 1 :]
    rows = split_top_level_rows(values_raw)
    new_rows: List[str] = []

    for row in rows:
        row = row.strip()
        if not (row.startswith("(") and row.endswith(")")):
            return statement

        inner = row[1:-1]
        values = split_sql_csv(inner)
        if target_idx >= len(values):
            return statement

        values.pop(target_idx)
        new_rows.append("(" + ", ".join(values) + ")")

    return f"INSERT INTO {table_name} ({', '.join(new_columns)}) VALUES\n" + ",\n".join(new_rows) + ";\n"


def should_remove_create_table_line(line: str, target_column: str) -> bool:
    # Matches lines like:
    #   "Photo" text,
    #   Photo varchar(max),
    pattern = re.compile(
        rf'^\s*(?:"{re.escape(target_column)}"|\[{re.escape(target_column)}\]|`{re.escape(target_column)}`|{re.escape(target_column)})\b',
        re.IGNORECASE,
    )
    return bool(pattern.match(line.strip()))


def process_file(
    input_path: str,
    output_path: str,
    target_column: str,
    keep_create_table_column: bool,
) -> None:
    statement_buffer: List[str] = []
    in_create_table = False

    with open(input_path, "r", encoding="utf-8", errors="ignore") as src, open(
        output_path, "w", encoding="utf-8"
    ) as dst:
        for line in src:
            stripped = line.strip()

            if statement_buffer:
                statement_buffer.append(line)
                if ";" in line:
                    statement = "".join(statement_buffer)
                    if re.match(r"^\s*INSERT\s+INTO\b", statement, re.IGNORECASE):
                        dst.write(process_insert_statement(statement, target_column))
                    else:
                        dst.write(statement)
                    statement_buffer = []
                continue

            if CREATE_TABLE_START_RE.match(line):
                in_create_table = True
                dst.write(line)
                continue

            if in_create_table:
                if not keep_create_table_column and should_remove_create_table_line(line, target_column):
                    continue

                dst.write(line)

                if stripped.endswith(");"):
                    in_create_table = False
                continue

            if re.match(r"^\s*INSERT\s+INTO\b", line, re.IGNORECASE):
                if ";" in line:
                    dst.write(process_insert_statement(line, target_column))
                else:
                    statement_buffer = [line]
                continue

            dst.write(line)

        if statement_buffer:
            statement = "".join(statement_buffer)
            if re.match(r"^\s*INSERT\s+INTO\b", statement, re.IGNORECASE):
                dst.write(process_insert_statement(statement, target_column))
            else:
                dst.write(statement)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Remove a large SQL dump column and its values safely in a streaming way."
    )
    parser.add_argument("input", help="Path to source .sql file")
    parser.add_argument("output", help="Path to cleaned .sql file")
    parser.add_argument(
        "--column",
        default="Photo",
        help="Column name to remove. Default: Photo",
    )
    parser.add_argument(
        "--keep-create-table-column",
        action="store_true",
        help="Keep the target column in CREATE TABLE statements and only remove it from INSERT data.",
    )

    args = parser.parse_args()

    process_file(
        input_path=args.input,
        output_path=args.output,
        target_column=args.column,
        keep_create_table_column=args.keep_create_table_column,
    )

    print(f"Done. Cleaned SQL written to: {args.output}")


if __name__ == "__main__":
    main()
