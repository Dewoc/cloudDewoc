import styled from "styled-components";
import { useEffect, useState } from "react";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { theme } from "../../settings.json";

type TableProps<R> = {
    headers: { key: string, text: string }[],
    rows: R[] | [],
    emptyText: string,
    breakPagination?: number
}

/**
 * @param rows Array of objects of type R. Where each header (of headers param) matchs with one key value in each object R 
 */
export default function Table({ headers, rows, emptyText, breakPagination = 5 }: TableProps<any>) {
    const [page, setPage] = useState<number>(0);
    const [paginatedRows, setPaginatedRows] = useState<[][]>([]);

    const paginateRows = (rows: any[]) => {
        let j = -1;
        // const breakPagination = 5; // const for handle the rows that are displayed

        return rows.reduce((accumulator: any[], currentValue: any, i) => {
            if (i % breakPagination === 0) { accumulator.push([currentValue]); j++; }
            else { accumulator[j].push(currentValue); }

            return accumulator;
        }, []);

    }

    useEffect(() => {
        setPage(0);
        rows.length && setPaginatedRows(paginateRows(rows));
    }, [rows]);

    return (rows.length && paginatedRows[0] && paginatedRows[0].length) ? <TableStyled theme={theme}>
        <thead>
            <tr>
                {headers.map(headerName => <th key={headerName.key}>{headerName.text}</th>)}
            </tr>
        </thead>
        <tbody>
            {
                paginatedRows[page].map((row) =>
                    <tr key={Math.random()}>
                        {row && headers.map(({ key }) =>
                            <td key={Math.random()}>{row[key]}</td>
                        )}
                    </tr>)
            }
        </tbody>
        <tfoot>
            <tr>
                <td colSpan={headers.length} align="center" valign="middle">
                    <button onClick={(e) => { e.preventDefault(); page > 0 && setPage(page - 1) }}><MdOutlineKeyboardArrowLeft size="1.3rem" /></button>
                    <strong>{`${page}`} de {paginatedRows.length - 1}</strong>
                    <button onClick={(e) => { e.preventDefault(); page < (paginatedRows.length - 1) && setPage(page + 1) }}>
                        <MdOutlineKeyboardArrowRight size="1.3rem" />
                    </button>
                </td>
            </tr>
        </tfoot>
    </TableStyled> : <strong>{emptyText}</strong>
}

const TableStyled = styled.table`
    border: solid 1px black;
    border-radius: 0.7rem;
    width: 80%;
    padding: 0.7rem;
    box-sizing: border-box;

    & > thead {
        position: sticky; 
        top: 0%;
        background-color: white;

        &::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 2px;
            background-color: ${props => props.theme.accentColor}
        };

        & > tr > th {
            text-align: left;
            min-width: 3rem;
            padding: 0 0.5rem 0 0.5rem;
            
            &::first-letter {
                text-transform: uppercase;
            }
            
            font-weight: normal;
            padding-bottom: 0.7rem;

            &:last-child, &:nth-last-child(2) { text-align: center; }
        }
    }

    & > tbody {
        & > tr > td {
            padding-top: 1rem;
            padding: 0.5rem;
            max-width: 450px;
            box-sizing: border-box;
            &:last-child, &:nth-last-child(2) { text-align: center; }
            word-break: break-all;
        }
    }

    & > tfoot {
        & > tr > td {
            padding-top: 1rem;
            
            & > strong {
                font-size: 1.2rem;
            }            
            & > button {
                background-color: transparent;
                border: solid 1px transparent;
                transform: translateY(20%);
                padding: 0.1rem;
                transition: 0.3s;
                border-radius: 5px;
                margin: 0 0.3rem 0 0.3rem;
                cursor: pointer;

                &:hover {
                    background-color: ${props => props.theme.accentColor};
                    border: solid 1px transparent;
                    color: white
                    
                }
            }
        }
    }
`;