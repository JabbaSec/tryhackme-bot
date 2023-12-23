const axios = require("axios");

const API_ROOM = "https://tryhackme.com/api/room/details?codes=";
const API_NEW_ROOM = "http://tryhackme.com/api/new-rooms/";
const API_TOKEN = "https://tryhackme.com/tokens/discord/";
const API_LEADERBOARD = "https://tryhackme.com/api/leaderboards";
const API_STATS = "https://tryhackme.com/api/site-stats";
const API_HACKTIVITIES = "https://tryhackme.com/api/hacktivities";
const API_USER = "https://tryhackme.com/api/discord/user/";
const API_GET_ARTICLES = "https://api.intercom.io/articles";
const API_SEARCH_ARTICLES = "https://api.intercom.io/articles/search";
const API_GET_ARTICLE_ID = "";

module.exports = (client) => {
  client.handleAPI = {
    get_room_data: async (code) => {
      try {
        const response = await axios.get(API_ROOM + code);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    get_token_data: async (token) => {
      try {
        const response = await axios.get(API_TOKEN + token);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    get_user_data: async (username) => {
      try {
        const response = await axios.get(API_USER + username);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    get_leaderboard_data: async (monthly = false) => {
      const query = monthly ? "?type=monthly" : "";
      try {
        const response = await axios.get(API_LEADERBOARD + query);
        return response.data["ranks"];
      } catch (error) {
        console.error(error);
      }
    },

    get_site_statistics: async () => {
      try {
        const response = await axios.get(API_STATS);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    get_public_rooms: async (filter_type = null) => {
      const query = filter_type ? `?type={filter_type}` : "";
      try {
        const response = await axios.get(API_HACKTIVITIES + query);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    get_articles: async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${process.env.INTERCOM_TOKEN}`,
            "Intercom-Version": "2.10",
          },
        };

        const response = await axios.get(API_ARTICLES, config);

        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    get_article_by_id: async (id) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${process.env.INTERCOM_TOKEN}`,
            "Intercom-Version": "2.10",
          },
        };

        const response = await axios.get(API_ARTICLES, config);

        return response.data;
      } catch (error) {
        console.error(error);
      }
    },

    get_article_by_phrase: async (phrase) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${process.env.INTERCOM_TOKEN}`,
            "Intercom-Version": "2.10",
          },
        };

        const response = await axios.get(
          API_SEARCH_ARTICLES + `?phrase=${phrase}`,
          config
        );

        if (response.data.total_count == 0) {
          return null;
        }

        const firstArticle = response.data.data.articles[0] || null;

        return firstArticle;
      } catch (error) {
        console.error(error);
      }
    },

    get_ollie_picture: async () => {
      try {
        const response = await axios.get("https://ollie.muirlandoracle.co.uk");
        const data = response.data;

        if (data.status === "success") {
          return data.message;
        } else {
          console.error("Picture retrieval failed: ", data);
          return null;
        }
      } catch (error) {
        console.error("Error fetching picture: ", error);
        return null;
      }
    },
  };
};
