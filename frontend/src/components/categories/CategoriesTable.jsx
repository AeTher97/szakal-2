import React, {useState} from 'react';
import {Link, Sheet, Table, Typography} from "@mui/joy";
import CategoryDialog from "./CategoryDialog";
import {CATEGORY_MODIFICATION} from "../../utils/AccessRightsList";
import {useAccessRightsHelper} from "../../utils/AccessRightsHelper";
import PropTypes from "prop-types";

const CategoriesTable = ({categories, modifyCategory}) => {

    const [modifyOpen, setModifyOpen] = useState(false);
    const [localCategory, setLocalCategory] = useState(null);
    const {hasRight} = useAccessRightsHelper();

    return (
        <Sheet sx={{
            width: '100%',
            borderRadius: 'sm',
            overflow: 'auto',
            display: "flex",
        }}>
            <Table
                variant={"outlined"}
                stickyHeader
                hoverRow
                sx={{
                    '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                    '--Table-headerUnderlineThickness': '1px',
                    '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                    '--TableCell-paddingY': '4px',
                    '--TableCell-paddingX': '8px',
                    '--TableCell-height': '0px'

                }}>
                <thead>
                <tr>
                    <th style={{padding: "12px 6px"}}>
                        <Typography>Nazwa</Typography>
                    </th>
                    <th style={{padding: "12px 6px"}}>
                        <Typography>Akcje</Typography>
                    </th>
                </tr>
                </thead>
                <tbody>
                {categories?.map(category =>
                    <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>{hasRight(CATEGORY_MODIFICATION) &&
                            <Link
                                  onClick={() => {
                                      setLocalCategory(category);
                                      setModifyOpen(true)
                                  }}>
                            Edytuj
                            </Link>}
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

CategoriesTable.propTypes = {
    categories: PropTypes.array,
    modifyCategory: PropTypes.func.isRequired
}

export default CategoriesTable;