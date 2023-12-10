import React, { useState, useEffect } from "react";
import {Link, useLocation} from "react-router-dom";
import {reformatDate, reformatTime} from "./list";
import './create.css'

function Results() {
    const location = useLocation();
    const searchText = location.state?.searchText || new URLSearchParams(location.search).get("q" + "") || "";
    const [searchResults, setSearchResults] = useState({
        posts: [],
        forums: [],
        searchCount: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch posts
                const postsResponse = await fetch("http://127.0.0.1:8000/api/posts/");
                const postsData = await postsResponse.json();

                // filter the list of posts by the search result
                const filteredPosts = postsData.filter(post =>
                    post.title.toLowerCase().includes(searchText.toLowerCase())
                );

                // Fetch forums
                const forumsResponse = await fetch("http://127.0.0.1:8000/api/forums/");
                const forumsData = await forumsResponse.json();

                const filteredForums = forumsData.filter(forum =>
                    forum.title.toLowerCase().includes(searchText.toLowerCase())
                );

                // Update state with fetched data
                setSearchResults({
                    posts: filteredPosts,
                    forums: filteredForums,
                    searchCount: filteredForums.length + filteredPosts.length
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [searchText]);


    return (

        <div className="col-md-9 col-sm-10 mt-4 mx-auto">
        <div>
            <h2 className={"m-3"}>Search Results: {searchResults.searchCount}</h2>
            <p className={"m-3"}>Search for: {searchText}</p>

            <div className={"card p-3"}>
                <h3 className={"m-3"}>Posts: {searchResults.posts.length}</h3>
                {searchResults.posts.map((post) => (
                    <div  key={post.id}>
                        <div className={"card postformat"}>
                            <Link to={`/post/${post.id}`} className={"links"}>View Details</Link>
                            <div className={"imgdisplay"}>
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
                                <p className={"smallinfotext"}>Posted by: {post.user.username}</p>
                                <p className={"smallinfotext"}>{reformatDate(post.datetime)} {reformatTime(post.datetime)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={"card d-inline-flex p-3 mt-4"}>
            <h3 className={"m-3"}>Forums: {searchResults.forums.length}</h3>
            <ul>
                {searchResults.forums.map((forum) => (
                    <div  key={forum.id}>
                        {/*show all the forum*/}
                        <div>
                            {/*show all the forum*/}
                                <div className={"card forumformat"}>
                                    <Link to={`/forum/${forum.id}`} className={"links m-1"}>View Details</Link>
                                    <div className={""}>
                                        <strong>{forum.title}</strong>
                                        <p>{forum.description}</p>
                                        <p className={"smallinfotext"}>Time: {reformatDate(forum.datetime)} {reformatTime(forum.datetime)}</p>
                                        <p className={"smallinfotext"}>User: {forum.user.username}</p>
                                    </div>
                                </div>
                        </div>
                    </div>
                ))}
            </ul>
            </div>
        </div>
        </div>
    );
}

export default Results;
