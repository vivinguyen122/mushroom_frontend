import React, { Component } from 'react';
import './create.css'
import {Link} from "react-router-dom";
import {Spinner, Tooltip} from "reactstrap";


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

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formattedForums: [],
            formattedPosts: [],
            loading: true,
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        setTimeout(() => { //delay loading
            fetch("http://127.0.0.1:8000/api/forums/") //get forum full list
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response not okay for forums");
                    }
                    return response.json();
                })
                .then(forums => {
                    const formattedForums = forums.map(forum => ({
                        ...forum,
                        // title: forum.description
                    }));
                    this.setState({ formattedForums, loading: false });
                })
                .catch(error => {
                    console.error('Problem with the fetch for forums', error);
                    this.setState({ loading: false });
                });
        }, 2000); // 2 second delay just to test loading

        setTimeout(() => { //delay loading
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
                    this.setState({ formattedPosts, loading: false });
                })
                .catch(error => {
                    console.error('Problem with the fetch for posts', error);
                    this.setState({ loading: false });
                });
    }, 2000); // 2 second delay just to test loading

}


    render() {
        return (
            <div className="col-md-9 col-sm-10 mt-4 mx-auto">
                {this.state.loading ? (
                    <div className="d-flex align-items-center justify-content-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (
                    <>
                        <div className="card p-3 mt-3">
                            <h2>Recent Posts</h2>
                            <Link className={"linkStyle"} to={"/post/all"}>View All Posts</Link>
                            <div>
                                {/*shows all the posts*/}
                                {this.state.formattedPosts.slice(0, 6).map(post => (
                                    <div className={"card postformat"} key={post.id}>
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
                            </div>
                        </div>

                        <div className="card p-3">
                            <div>
                                <h2>Active Forums</h2>
                                <Link className={"linkStyle"} to={"/forum/all"}>View All Forums</Link>
                                <div>
                                    {/*show all the forum*/}
                                    {this.state.formattedForums.slice(0, 2).map(forum => (
                                        <div className={"card forumformat"} key={forum.id}>
                                            <Link to={`/forum/${forum.id}`} className={"links m-1"}>View Details</Link>
                                            <div>
                                                <strong>{forum.title}</strong>
                                                <p>{forum.description}</p>
                                                {/*make the date look prettier?*/}
                                                <p className={"smallinfotext"}>Time: {reformatDate(forum.datetime)} {reformatTime(forum.datetime)}</p>
                                                <p className={"smallinfotext"}>User: {forum.user}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

}

export default Home;
