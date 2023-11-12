const axios = require("axios");

const API_ROOM = "https://tryhackme.com/api/room/details?codes=";
const API_NEW_ROOM = "http://tryhackme.com/api/new-rooms/";
const API_TOKEN = "https://tryhackme.com/tokens/discord/";
const API_LEADERBOARD = "https://tryhackme.com/api/leaderboards";
const API_STATS = "https://tryhackme.com/api/site-stats";
const API_HACKTIVITIES = "https://tryhackme.com/api/hacktivities";
const API_USER = "https://tryhackme.com/api/discord/user/";

module.exports = (client) => {
  client.handleAPI = {
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

    get_public_rooms: async (filter_type = null) => {
      const query = filter_type ? `?type={filter_type}` : "";
      try {
        const response = await axios.get(API_HACKTIVITIES + query);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
  };
};
