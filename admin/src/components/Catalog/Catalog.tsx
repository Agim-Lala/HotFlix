import React, { useState, useEffect, useCallback } from "react";
import { Input, Select, Space } from "antd";
import {
  SearchOutlined,
  
} from "@ant-design/icons";
import SidebarLayout from "../layouts/SidebarLayout"; 
import { fetchMovies, PaginatedMovieResponse, SortFields } from "../../api/movieApi"; 
import {Movie} from "../../api/movieApi";

const sortOptions = [
  "Id",
  "Title",
  "Rating",
  "Category",
  "Views",
  "Status",
  "Created At",
];

const Catalog = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieCount, setMovieCount] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState<SortFields>(SortFields.CreatedAt);


  const fetchMovieData = useCallback(async (sortBy: SortFields) => {
    try {
      const response: PaginatedMovieResponse = await fetchMovies({
        sortBy,
        ascending: false,
        page: 1,
        pageSize: 10, 
      });
      setMovies(response.movies);
      setMovieCount(response.totalCount);
    } catch (error) {
      console.error("Error fetching movies", error);
    }
   
  }, [setMovies, setMovieCount]); 

  
  useEffect(() => {
    fetchMovieData(SortFields.CreatedAt);
  }, [fetchMovieData]); 

 
  useEffect(() => {
    
    const sortField = SortFields[selectedSort as keyof typeof SortFields];
    if (sortField) { 
         fetchMovieData(sortField);
    } else {
        console.error(`Invalid sort field selected: ${selectedSort}`);
    }

  }, [selectedSort, fetchMovieData]);
 

  return (
    <SidebarLayout>
      
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1 rem",
          paddingBottom: "0.7rem", 
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)", 
        }}
      >
      
        <div>
          <div style={{ fontSize: "24px", fontWeight: 600, color: "white" }}>
            Catalog
            <span style={{ fontSize: "12px", color: "#aaa", marginLeft: 8, opacity: 0.8 }}>
             {movieCount} Movies
            </span>
          </div>
        </div>

       
        <Space align="end" size="middle">
          <div>
            <div style={{ color: "cccccc", fontSize: "12px",  }}>
              Sort by:
            </div>
            <Select
              value={selectedSort}
              onChange={(value) => setSelectedSort(value)}
              style={{
                width: 140, 
                backgroundColor: "#302c34",
                color: "#f0f0f0",
              }}
              bordered={false} 
              dropdownStyle={{
                backgroundColor: '#2a2a2e',
              }}
              
              options={sortOptions.map((item) => ({
                value: item,
                label: <span style={{ color: "#f0f0f0" }}>{item}</span>,
              }))}
            />
          </div>

          
          <Input
            placeholder="Find movie / TV series..."
            suffix={<SearchOutlined style={{ color:"#f0f0f0" }} />}
            style={{
              width: 220, 
              backgroundColor: "#302c34",
              color: "#ffffff",
            }}
            bordered={false} 
          />
        </Space>
      </div>

      <div style={{ color: "#999", paddingTop: "1rem" }}>
        Catalog 
      </div>
    </SidebarLayout>
  );
};

export default Catalog;
