const apiKey = '6cc9e5c'; // Your provided API key
const moviesContainer = document.getElementById('moviesContainer');

// Fetch movie data based on search query (title or IMDb ID)
async function searchMovies() {
  const query = document.getElementById('movieSearch').value.trim();
  let url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);  // Check API response in console

    if (data.Response === "True") {
      // Fetch more detailed movie info using IMDb IDs
      const detailedMovies = await Promise.all(data.Search.map(async movie => {
        const detailUrl = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`;
        const detailResponse = await fetch(detailUrl);
        return await detailResponse.json();  // Return detailed movie info
      }));

      displayMovies(detailedMovies);
    } else {
      moviesContainer.innerHTML = `<p>No movies found.</p>`;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    moviesContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
  }
}

// Display movie results
function displayMovies(movies) {
  moviesContainer.innerHTML = '';
  movies.forEach(movie => {
    const poster = (movie.Poster && movie.Poster !== 'N/A') 
    ? movie.Poster 
    : 'MOVIE NOT FOUND.jpg';  // Relative path to fallback image

    moviesContainer.innerHTML += `
      <div class="movie">
        <img src="${poster}" alt="${movie.Title}" style="width:150px; height:auto;">
        <h3>${movie.Title} (${movie.Year})</h3>
        <p><strong>Genre:</strong> ${movie.Genre || 'N/A'}</p>
        <p><strong>Director:</strong> ${movie.Director || 'N/A'}</p>
        <p><strong>Actors:</strong> ${movie.Actors || 'N/A'}</p>
        <p><strong>Plot:</strong> ${movie.Plot || 'N/A'}</p>
        <p><strong>IMDb Rating:</strong> ${movie.imdbRating || 'N/A'}</p>
        <button onclick="addToFavorites('${movie.imdbID}')">Add to Favorites</button>
      </div>
    `;
  });
}

// Add movie to favorites list
function addToFavorites(movieId) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(movieId)) {
    favorites.push(movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Movie added to favorites');
  } else {
    alert('Movie already in favorites');
  }
}
