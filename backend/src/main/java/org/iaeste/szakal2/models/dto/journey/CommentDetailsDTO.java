package org.iaeste.szakal2.models.dto.journey;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.dto.user.UserDTO;
import org.iaeste.szakal2.models.entities.Comment;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentDetailsDTO {

    private String comment;
    private LocalDateTime date;
    private UserDTO user;

    public static CommentDetailsDTO fromComment(Comment comment) {
        return CommentDetailsDTO.builder()
                .comment(comment.getComment())
                .date(comment.getDate())
                .user(UserDTO.fromUser(comment.getUser()))
                .build();
    }
}
