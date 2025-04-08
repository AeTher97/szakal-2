import React, {useState} from 'react';
import {Divider, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import UserAvatar from "../../misc/UserAvatar";
import {TextAreaWithLimit} from "../../misc/InputWithLimit";
import PropTypes from "prop-types";
import {formatLocalDateTime} from "../../../utils/DateUtils";

const Comment = ({comment, userId, editComment}) => {
    const [editing, setEditing] = useState(false);
    const [editingValue, setEditingValue] = useState(comment.comment);

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (editingValue !== "") {
            editComment(comment.id, editingValue, userId);
            setEditing(false);
        }
    };

    return (
        <div style={{display: "flex", flexDirection: "column", margin: 5}}>
            <div style={{display: "flex", gap: 5, alignItems: "center"}}>
                <UserAvatar
                    id={comment.user.id}
                    name={comment.user.name}
                    surname={comment.user.surname}
                    committee={comment.user.committee}
                    image={comment.user.profilePicture}
                    overrideMobile={true}
                    size={"sm"}
                />
            </div>
            {editing ? (
                <form onSubmit={handleEditSubmit} style={{display: "flex", flexDirection: "column", gap: 5}}>
                    <TextAreaWithLimit
                        minRows={2}
                        required
                        value={editingValue}
                        limit={comment.limit}
                        isValid={true}
                        onChange={(e) => setEditingValue(e.target.value)}
                        placeholder={"Komentarz"}
                    />
                    <div style={{display: "flex", justifyContent: "flex-end", gap: 5}}>
                        <Button type={"submit"}>Zapisz</Button>
                        <Button onClick={() => setEditing(false)}>Anuluj</Button>
                    </div>
                </form>
            ) : (
                <>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <Typography level={"body-md"}>{comment.comment}</Typography>
                        <Button onClick={() => setEditing(true)}>Edytuj</Button>
                    </div>
                </>
            )}
            <Typography level={"body-xs"}>{formatLocalDateTime(comment.date)}</Typography>
            <Divider/>
        </div>
    );
};

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    editComment: PropTypes.func.isRequired,
};

export default Comment;