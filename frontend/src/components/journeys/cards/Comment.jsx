import React, {useState} from 'react';
import {Button, Divider, Link, Typography} from "@mui/joy";
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
            <div style={{display: "flex", gap: 5, flex: 2}}>
                <UserAvatar
                    id={comment.user.id}
                    name={comment.user.name}
                    surname={comment.user.surname}
                    email={comment.user.email}
                    image={comment.user.profilePicture}
                    text={false}
                    size={"sm"}
                />
                <div>
                    <Typography level={"title-sm"}>{comment.user.name} {comment.user.surname}</Typography>
                    <Typography
                        level={"body-xs"}>{formatLocalDateTime(comment.date)}{comment.edited ? ", (Edytowany)" : ""}</Typography>
                </div>
            </div>
            {editing ? (
                <form onSubmit={handleEditSubmit} style={{display: "flex", flexDirection: "column", gap: 5}}>
                    <TextAreaWithLimit
                        data-testid="edit-comment-textarea"
                        minRows={2}
                        required
                        value={editingValue}
                        limit={comment.limit}
                        isValid={true}
                        onChange={(e) => setEditingValue(e.target.value)}
                        placeholder={"Komentarz"}
                    />
                    <div style={{display: "flex", justifyContent: "flex-end", gap: 5, marginTop: 7, marginBottom: 10}}>
                        <Button type={"submit"} data-testid="save-comment-button">Zapisz</Button>
                        <Button color="neutral" onClick={() => setEditing(false)}>
                            Anuluj
                        </Button>
                    </div>
                </form>
            ) : (
                <>
                    <Typography level={"body-md"} style={{marginBottom: 5}}>{comment.comment}</Typography>
                    {userId === comment.user.id && (
                        <Link
                            onClick={() => setEditing(true)}
                            data-testid="edit-comment-link"
                            style={{cursor: "pointer", marginBottom: 10}}>
                            Edytuj
                        </Link>
                    )}
                </>
            )}
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