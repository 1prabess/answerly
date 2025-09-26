import React from "react";
import { MessageCircle, Share2, ArrowBigUp } from "lucide-react";

const dummyPosts = [
  {
    id: 1,
    subreddit: "r/googlecloud",
    time: "3 days ago • Suggested for you",
    title:
      "Student hit with a $55,444.78 Google Cloud bill after Gemini API key leaked on GitHub",
    content:
      "Hi everyone, I never thought I'd end up in this kind of situation, but here I am. I signed up for Google Cloud with my student email and was only using the $300 free credit they give you. Out of that, I had spent about $80. That’s it. I had more than $220 left and I wasn’t running anything serious, just doing small experiments for learning...",
    upvotes: 397,
    comments: 223,
  },
  {
    id: 2,
    subreddit: "r/technepal",
    time: "1 day ago • Because you've shown interest in this community",
    title: "Does GPA matter",
    content:
      "I am right now in 12 class studying Management I want to know your experience to know about internship jobs interviews what is the minimum gpa to score for a better future",
    upvotes: 2,
    comments: 5,
  },
  {
    id: 3,
    subreddit: "r/technepal",
    time: "2 days ago • Because you've shown interest in this community",
    title: "Dam. All paid courses & certificates FOR FREE!! Coursera",
    content:
      "Broo, using this new trick, we can get any premium course of COURSERA and it's certificate for totally FREE. Grab the opportunity rn, it'll be helpful for internships & JOBS https://youtu.be/6FiEzpOpQ4E...",
    upvotes: 44,
    comments: 27,
  },
];

const HomePage = async () => {
  return (
    <div className="space-y-4">
      {dummyPosts.map((post) => (
        <div key={post.id} className="p-4 border-b">
          <div className="mb-2 flex justify-between items-center text-sm">
            <span>
              <span className="font-semibold">{post.subreddit}</span> •{" "}
              {post.time}
            </span>
            <button className="font-medium">Join</button>
          </div>

          <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
          <p className="mb-3 text-sm text-muted-foreground">{post.content}</p>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <ArrowBigUp size={18} />
              <span>{post.upvotes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={18} />
              <span>{post.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 size={18} />
              <span>Share</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
