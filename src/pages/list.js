import Container from "react-bootstrap/Container";

import React, { Component } from 'react';
import './create.css'
import {Link} from "react-router-dom";

export function reformatDate (datetime){
    const dateObject = new Date(datetime);
    const formattedDate = dateObject.toISOString().split('T')[0]; //get date before the t
    return `Date: ${formattedDate}`;
}

export function reformatTime (datetime){
    const dateObject = new Date(datetime);
    const formattedTime = dateObject.toISOString().split('T')[1].split('.')[0]; //get date before the t
    return `Time: ${formattedTime}`;
}

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formattedForums: [],
            formattedPosts: [],
        };
    }

    componentDidMount() {
        fetch("http://127.0.0.1:8000/api/forums/") //get forum full list
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response not okay")
                }
                return response.json();

            })
            .then(forums => {
                const formattedForums = forums.map(forum => ({
                    ...forum,
                }));
                this.setState({ formattedForums });
            })
            .catch(error => {
                console.error('Problem with the fetch', error)
            });

        fetch("http://127.0.0.1:8000/api/posts/") //get post list full
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response not okay for posts");
                }
                return response.json();
            })
            .then(posts => {
                const formattedPosts = posts.map(post => ({
                    ...post,
                }));
                this.setState({ formattedPosts });
            })
            .catch(error => {
                console.error('Problem with the fetch for posts', error);
            });
    }

    render() {

        // Filter favourite forums
        const favouriteForums = this.state.formattedForums.filter(forum => forum.favourite);

        // Filter favourite posts
        const favouritePosts = this.state.formattedPosts.filter(post => post.favourite);


        return (
            <div className="col-md-9 col-sm-10 mt-4 mx-auto">
                <div className="card p-3">
                    <div>
                        <h2>Favourite Forums</h2>
                        <ul>
                            {/*show all the forum*/}
                            <div>
                                {/*show all the forum*/}
                                {favouriteForums.slice(0, 2).map(forum => (
                                    <div className={"card forumformat hovergrow"}>
                                        <Link to={`/forum/${forum.id}`} className={"links m-1"}>View Details</Link>
                                        <div className={""}>
                                            <strong>{forum.title}</strong>
                                            <p>{forum.description}</p>
                                            {/*make the date look prettier?*/}
                                            <p className={"smallinfotext"}>Time: {reformatDate(forum.datetime)} {reformatTime(forum.datetime)}</p>
                                            <p className={"smallinfotext"}>User: {forum.username}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ul>
                    </div>
                </div>

                <div className="card p-3 mt-3">
                    <h2>Favourite Posts</h2>
                    <ul>
                        {/*shows all the posts*/}
                        {favouritePosts.slice(0, 4).map(post => (
                            <div className={"card postformat"}>
                                {/*for query when passed to get more info*/}
                                {/*<Link to={`/post/id=${post.id}`} className={"links"}>View Details</Link>*/}
                                <Link to={`/post/${post.id}`} className={"links"}>View Details</Link>
                                <div className={"imgdisplay"}>
                                    {/*displays the img posted by user if it exists*/}
                                    {post.img ? (
                                        <img className={"photosizing"} src={`http://127.0.0.1:8000${post.img}`} alt={post.img} />
                                    ) : (
                                        // Display a placeholder image if post.img is not present
                                        <img className={"photosizing"} src={`http://127.0.0.1:8000/media/uploads/placeholder.png`} alt="Placeholder" />
                                    )}
                                </div>
                                {/*text box display*/}
                                <div className={"textinfodisplay"}>
                                    <h3 className={"line-clamp"}>{post.title}</h3>
                                    <p className={"line-clamp"}>{post.description}</p>
                                    <p className={"smallinfotext"}>Posted by: {post.username}</p>
                                    <p className={"smallinfotext"}>{reformatDate(post.datetime)} {reformatTime(post.datetime)}</p>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>`
            </div>

        );
    }
}

export default List