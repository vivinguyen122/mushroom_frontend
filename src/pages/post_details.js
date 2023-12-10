import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {reformatDate, reformatTime} from './home'
import Heart from "react-heart";

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState({});
    // heart for favourite book check

    //fetch on mount: remember when doing for forum VVV
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}/`);
                const postData = await response.json();
                setPost(postData); //update the state with the fetched data
            } catch (error) {
                console.error('Problem with the fetch for post details', error);
            }
        };

        fetchPostDetails();
    }, [id]);

    //set favourite + make heart. toggle/edit from a2
    const toggleFavourite = async () => {
        fetch(`http://127.0.0.1:8000/api/posts/${id}/`, {
        method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            favourite: !post.favourite,
        }),
    })
    .then(response => {
            if (response.ok) {
                // alert('Added to Favourites!');
                setPost((prevPost) => ({
                    ...prevPost,
                    favourite: !prevPost.favourite,
                }));
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
    })
        .catch(error => {
            console.error('There has been a problem with your favourite operation:', error);
            alert('Error 404: Favourite could not be toggled');
        });
}

    return (
        <div>
            <Link className={"links"} to="/">Go back</Link>
            <div className="card col-md-9 col-sm-10 mt-4 mx-auto">
                <div className={""}>
                    <div className={"detailimgDisplay m-1"}>
                        {/*displays the img posted by user if it exists*/}
                        {post.img ? (
                            <img className={"photosizing"} src={`http://127.0.0.1:8000${post.img}`} alt={post.img} />
                        ) : (
                            // Display a placeholder image if post.img is not present
                            <img className={"photosizing"} src={`http://127.0.0.1:8000/media/uploads/placeholder.png`} alt="Placeholder" />
                        )}
                    </div>
                    {/*text box display*/}
                    <div className={"detailtextbox"}>
                        <h2>{post.title}</h2>
                        <p className={"smallinfotext"}>Posted by: {post.user && post.user.username}</p>
                        {/*no more crash on load*/}
                        <p className={"smallinfotext"}>{post.datetime && `${reformatDate(post.datetime)} ${reformatTime(post.datetime)}`}</p>
                        <p>{post.description}</p>
                        {/*favourite heart button*/}
                        <div style={{ width: "2rem" }}>
                            <Heart isActive={post.favourite}
                                   onClick={toggleFavourite}
                                   animationScale = {1.25}
                                   style = {{marginBottom:'1rem'}} />
                        </div>

                    </div>
                </div>
            </div>
    </div>

);
}

export default PostDetails;
