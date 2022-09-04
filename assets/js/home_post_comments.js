// Let's implement this via classes
// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX
class PostComments{
       // constructor is used to initialize the instance of the class whenever a new instance is created
       constructor(postId){
        this.postId=postId;
        this.postContainer=$(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        this.creatingComment(postId);
        let self=this;
        //call for all the existing comments
        $(' .delete-comment-button',this.postContainer).each(function()
        {
            self.deleteComment($(this));
        });

    }
    


//creating comment
    creatingComment(postId){
        let pSelf=this;
        console.log('hey')
        this.newCommentForm.submit(function(e)
        {
            
            e.preventDefault();
            $.ajax(
                {
                    type:'post',
                    url:'/comments/create',
                    data:$(this).serialize(),
                    success:function(data)
                    {
                        let newComment=pSelf.newCommentDom(data.data.comment)
                       $(`#post-comments-${postId}`).prepend(newComment);
                       pSelf.deleteComment($(' .delete-comment-button',newComment))
                       new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    },
                    error:function(error)
                    {
                        console.log(error);
                    }

                }
            )
        })

    }
    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${ comment._id }">
                        <p>
                            
                            <small>
                                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                            </small>
                            
                            ${comment.content}
                            <br>
                            <small>
                                ${comment.user.name}
                            </small>
                        </p>    

                </li>`);
    }
    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}