import React, { useState } from 'react'
import "./Feed.css"
import CreatePost from './createPost/CreatePost';
import Posts from './posts/Posts';

function Feed() {
    const [feedType, setFeedtype] = useState("forYou");


    return (
        <main className="feed">
            <header>
                <div className='follow position-sticky bottom-0'>
                    <div className="feed__header" onClick={()=>setFeedtype("forYou")}> 
                        <h5 className='forYou'>For you</h5>
                        {feedType === "forYou" && (
							<div className='underline'></div>
						)}
                    </div>
                    <div className="feed__header" onClick={()=>setFeedtype("following")}>
                        
                        <h5 className='following'>Following</h5>
                        {feedType === "following" && (
							<div className='underline'></div>
						)}
                    </div>
                </div>
                <CreatePost/>
            </header>
            <Posts feedType={feedType}/>
        </main>
    )
}

export default Feed