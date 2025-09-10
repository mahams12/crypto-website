// src/hooks/useNews.js
import { useQuery } from "@tanstack/react-query";
import { newsService } from "../services/api";

// -----------------------
// Get paginated news
// -----------------------
export const useNews = (page = 1, limit = 20, category = "all") => {
  return useQuery({
    queryKey: ["news", page, limit, category],
    queryFn: () => newsService.getNews(page, limit, category),
    select: (res) => res?.data,
  });
};

// -----------------------
// Get latest news
// -----------------------
export const useLatestNews = (limit = 10) => {
  return useQuery({
    queryKey: ["latestNews", limit],
    queryFn: () => newsService.getLatestNews(limit),
    select: (res) => res?.data,
  });
};

// -----------------------
// Get news by category
// -----------------------
export const useNewsByCategory = (category, page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["newsByCategory", category, page, limit],
    queryFn: () => newsService.getNewsByCategory(category, page, limit),
    enabled: !!category,
    select: (res) => res?.data,
  });
};

// -----------------------
// Get list of categories
// -----------------------
export const useNewsCategories = () => {
  return useQuery({
    queryKey: ["newsCategories"],
    queryFn: () => newsService.getNewsCategories(),
    select: (res) => res?.data,
  });
};
