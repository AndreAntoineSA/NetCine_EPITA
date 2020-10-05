const API_KEY = "a7c90f3c292ee52388f544e066d2ad92"

const requests = {
    fetchTrending : `/trending/all/week?api_key=${API_KEY}&language=en-US`,
    fetchMostwatched: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
    fetchToprated :`/movie/top_rated?api_key=${API_KEY}&language=en-US`,
    fetchActionmovies: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
    fetchComedymovies: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
    fetchHorrormovies: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
    fetchRomancemovies:`/discover/movie?api_key=${API_KEY}&with_genres=10749`,
    fetchDocumentries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
}

export default requests;