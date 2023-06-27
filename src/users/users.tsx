import React, { useEffect, useState } from "react";
import { api } from "../services/apiServices";
import InfiniteScroll from "react-infinite-scroll-component";

// Define the type for a user
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
}

export interface ResponseType {
  data: User[];
  total_page?: number;
  total?: number;
}

const Users: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [postsFilter, setPostsFilter] = useState({
    page: 1,
    per_page: 8,
  });
  const [responseData, setResponse] = useState<ResponseType>({
    data: [],
    total_page: 0,
    total: 0,
  });
  const [hasMore, setHasMore] = useState<boolean>(true);

  //Timeout used to show the pulse loader at the
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      fetchUsers();
    }, 3000);
  }, []);

  const fetchUsers = async (postFilter = postsFilter) => {
    setIsLoading(false);
    try {
      const response: ResponseType = await api.get("/users", {
        params: {
          page: postFilter.page,
          per_page: postFilter.per_page,
        },
      });
      if (response.data) {
        if (postFilter.page === 1) {
          setResponse({
            data: response.data,
            total_page: response.total_page,
            total: response.total,
          });
        } else {
          //to show the loading message in the bottom
          setTimeout(() => {
            setResponse({
              ...responseData,
              data: [...responseData.data, ...response.data],
              total_page: response.total_page,
              total: response.total,
            });
          }, 1500);
        }
        setPostsFilter({
          ...postsFilter,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  console.log(responseData);
  const fetchNextPosts = () => {
    if (responseData?.total === responseData?.data?.length) {
      setHasMore(false);
      return;
    }
    const postFilter = {
      ...postsFilter,
      page: postsFilter.page + 1,
    };
    fetchUsers(postFilter);
  };

  if (isLoading) {
    return (
      <div className="pulse">
        <div className="greenDot" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="p-5 text-xl font-semibold bg-slate-300 text-center">
        Users
      </h1>
      <InfiniteScroll
        dataLength={responseData?.data?.length as number}
        next={fetchNextPosts}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>There are no more users</b>
          </p>
        }
      >
        {responseData?.data?.map((user: User, index: number) => (
          <>
            <div className="flex gap-3 p-5" key={index}>
              <img
                src={user.avatar}
                alt=""
                className="w-12 h-12 rounded-full"
              />
              <span className="flex items-center text-lg ml-2 font-semibold">
                {user.first_name + " " + user.last_name}
              </span>
            </div>
            <hr />
          </>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Users;
