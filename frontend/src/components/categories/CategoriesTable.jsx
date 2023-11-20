import React, {useState} from 'react';
import {Link, Sheet, Table, Typography} from "@mui/joy";
import CategoryDialog from "./CategoryDialog";

const CategoriesTable = ({categories, modifyCategory}) => {

    const [modifyOpen, setModifyOpen] = useState(false);
    const [localCategory, setLocalCategory] = useState(null);

    return (
        <Sheet sx={{
            width: '100%',
            borderRadius: 'sm',
            overflow: 'auto',
            display: "flex",
        }}>
            <Table
                stickyHeader
                hoverRow
                sx={{
                    '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                    '--Table-headerUnderlineThickness': '1px',
                    '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                    '--TableCell-paddingY': '4px',
                    '--TableCell-paddingX': '8px',
                }}>
                <thead>
                <tr>
                    <th>
                        <Typography>Nazwa</Typography>
                    </th>
                    <th>
                        <Typography>Działania</Typography>
                    </th>
                </tr>
                </thead>
                <tbody>
                {categories && categories.map(category =>
                    <tr key={category.id}>
                        <td>{category.name}</td>
                        <td><Link variant={"soft"}
                                  onClick={() => {
                                      setLocalCategory(category);
                                      setModifyOpen(true)
                                  }}>
                            Edytuj
                        </Link>
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
            <CategoryDialog
                open={modifyOpen}
                localCategory={localCategory}
                close={() => setModifyOpen(false)}
                addCategory={(name) => {
                    modifyCategory(localCategory.id, name)
                }}/>
        </Sheet>
    );
};

export default CategoriesTable;