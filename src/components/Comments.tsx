import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import { MessageSquare, Reply, Trash2, Send } from "lucide-react";
import toast from "react-hot-toast";

const GET_COMMENTS = gql`
  query GetComments($recipeId: ID!, $parentCommentId: ID) {
    comments(recipeId: $recipeId, parentCommentId: $parentCommentId) {
      id
      content
      createdAt
      user {
        id
        username
      }
      replies {
        id
        content
        createdAt
        user {
          id
          username
        }
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($recipeId: ID!, $content: String!, $parentCommentId: ID) {
    addComment(
      recipeId: $recipeId
      content: $content
      parentCommentId: $parentCommentId
    ) {
      id
      content
      createdAt
      user {
        id
        username
      }
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId)
  }
`;

interface CommentsProps {
  recipeId: string;
}

function Comments({ recipeId }: CommentsProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{
    id: string;
    username: string;
  } | null>(null);

  const { data, loading, refetch } = useQuery(GET_COMMENTS, {
    variables: { recipeId },
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setNewComment("");
      setReplyTo(null);
      refetch();
      toast.success("Comment added successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: () => {
      refetch();
      toast.success("Comment deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent, parentCommentId?: string) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({
        variables: {
          recipeId,
          content: newComment.trim(),
          parentCommentId: parentCommentId || null,
        },
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment({
          variables: { commentId },
        });
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`${isReply ? "ml-8 mt-3" : "mb-6"}`}>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-amber-800 font-medium">
                {comment.user.username[0].toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900">
                {comment.user.username}
              </span>
              <p className="text-sm text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {user?.id === comment.user.id && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="text-gray-700 mb-3">{comment.content}</p>

        {!isReply && (
          <button
            onClick={() =>
              setReplyTo({ id: comment.id, username: comment.user.username })
            }
            className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors"
          >
            <Reply className="h-4 w-4" />
            Reply
          </button>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} isReply={true} />
      ))}
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-amber-600" />
        Comments
      </h2>

      {/* Comment form */}
      <form onSubmit={(e) => handleSubmit(e, replyTo?.id)} className="mb-8">
        <div className="relative">
          {replyTo && (
            <div className="absolute -top-6 left-0 text-sm text-amber-600 flex items-center gap-1">
              <Reply className="h-4 w-4" />
              Replying to {replyTo.username}
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 border-2 border-amber-100 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
          {data?.comments.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Comments;
