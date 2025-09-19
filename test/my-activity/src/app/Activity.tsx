import { useSyncState } from '@robojs/sync'
import sync from 'config/plugins/robojs/sync'
import { useEffect, useRef, useState } from 'react'

import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';

import { VideoPlayer } from '../components/VideoPlayer';
import { VideoList } from '../components/Videolist';

export const Activity = () => {

    const [selectedVideo, setSelectedVideo] = useState(null)

    // setSelectedVideo()

    const videoData = [
        { id: 1, title: 'Highlander', url: "/videos/Media/Movies/highlander.mp4" },
        { id: 2, title: 'Moana 2', url: "/videos/Media/Movies/Moana 2 (2024) [1080p] [WEBRip] [x265] [10bit] [5.1] [YTS.MX]/Moana.2.2024.1080p.WEBRip.x265.10bit.AAC5.1-[YTS.MX].mp4" },
        { id: 3, title: 'A clock work orange', url: '/videos/Media/Movies/A Clockwork Orange (1971)/A Clockwork Orange (1971).mkv' },
        { id: 4, title: 'Kill Bill: Vol. 1', url: '/videos/Media/Movies/Quinton_tarrentino/Kill.Bill.Vol.1.2003.1080p.BrRIp.x264.YIFY.mp4' },
        { id: 5, title: 'Kill Bill: Vol. 2', url: '/videos/Media/Movies/Quinton_tarrentino/Kill.Bill.Vol.2.2004.1080p.BrRIp.x264.YIFY.mp4' },

    ];

    const handleVideoSelect = (videoUrl) => {
        setSelectedVideo(videoUrl);
    };

    const handleClose = (videoUrl) => {
        setSelectedVideo(null)
    }

    if (selectedVideo) {
        return (
            <div className="app-container">

                <div className="video-player-container">
                    {/* <h3>Video Player</h3> */}
                    <VideoPlayer videosrc={selectedVideo} handleClose={handleClose}/>
                </div>
            </div>
        )
    } else {
        return (
            <div className="app-container">
              <div className="video-list-container">
                <h3>Video List</h3>
                <VideoList videos={videoData} onVideoSelect={handleVideoSelect} />
              </div>
            </div>
          );
    }

    
}


// test
// import React, { useState } from 'react';
// import { Play, Star, Calendar, Clock, Film, Tv, Search, Grid3X3, List } from 'lucide-react';

// const Activity = () => {
//   // Sample data for movies
//   const movies = [
//     {
//       id: 1,
//       title: "The Matrix",
//       year: 1999,
//       rating: 8.7,
//       duration: "136 min",
//       genre: "Sci-Fi, Action",
//       poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
//       description: "A computer programmer discovers reality as he knows it is a simulation."
//     },
//     {
//       id: 2,
//       title: "Inception",
//       year: 2010,
//       rating: 8.8,
//       duration: "148 min",
//       genre: "Sci-Fi, Thriller",
//       poster: "https://images.unsplash.com/photo-1489599235854-648dee8dd27a?w=300&h=450&fit=crop",
//       description: "A thief enters people's dreams to steal secrets from their subconscious."
//     },
//     {
//       id: 3,
//       title: "Interstellar",
//       year: 2014,
//       rating: 8.6,
//       duration: "169 min",
//       genre: "Sci-Fi, Drama",
//       poster: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=450&fit=crop",
//       description: "A team of explorers travel through a wormhole in space."
//     },
//     {
//       id: 4,
//       title: "The Dark Knight",
//       year: 2008,
//       rating: 9.0,
//       duration: "152 min",
//       genre: "Action, Crime",
//       poster: "https://images.unsplash.com/photo-1509347528160-9329d5b9b9aa?w=300&h=450&fit=crop",
//       description: "Batman faces the Joker in this acclaimed superhero film."
//     },
//     {
//       id: 5,
//       title: "Pulp Fiction",
//       year: 1994,
//       rating: 8.9,
//       duration: "154 min",
//       genre: "Crime, Drama",
//       poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
//       description: "The lives of two mob hitmen intersect in this iconic film."
//     },
//     {
//       id: 6,
//       title: "Avatar",
//       year: 2009,
//       rating: 7.8,
//       duration: "162 min",
//       genre: "Sci-Fi, Adventure",
//       poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
//       description: "A marine on an alien planet becomes torn between two worlds."
//     }
//   ];

//   // Sample data for series
//   const series = [
//     {
//       id: 1,
//       title: "Breaking Bad",
//       year: "2008-2013",
//       rating: 9.5,
//       seasons: 5,
//       episodes: 62,
//       genre: "Crime, Drama",
//       poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop",
//       description: "A chemistry teacher turned methamphetamine manufacturer."
//     },
//     {
//       id: 2,
//       title: "Stranger Things",
//       year: "2016-2025",
//       rating: 8.7,
//       seasons: 4,
//       episodes: 42,
//       genre: "Sci-Fi, Horror",
//       poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
//       description: "Kids in a small town uncover supernatural mysteries."
//     },
//     {
//       id: 3,
//       title: "The Office",
//       year: "2005-2013",
//       rating: 9.0,
//       seasons: 9,
//       episodes: 201,
//       genre: "Comedy",
//       poster: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=300&h=450&fit=crop",
//       description: "Mockumentary about office life at a paper company."
//     },
//     {
//       id: 4,
//       title: "Game of Thrones",
//       year: "2011-2019",
//       rating: 8.5,
//       seasons: 8,
//       episodes: 73,
//       genre: "Fantasy, Drama",
//       poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
//       description: "Noble families vie for control of the Iron Throne."
//     },
//     {
//       id: 5,
//       title: "The Crown",
//       year: "2016-2023",
//       rating: 8.6,
//       seasons: 6,
//       episodes: 60,
//       genre: "Biography, Drama",
//       poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop",
//       description: "The reign of Queen Elizabeth II from the 1940s to modern times."
//     },
//     {
//       id: 6,
//       title: "Friends",
//       year: "1994-2004",
//       rating: 8.9,
//       seasons: 10,
//       episodes: 236,
//       genre: "Comedy, Romance",
//       poster: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=300&h=450&fit=crop",
//       description: "Six friends navigate life and love in New York City."
//     }
//   ];

//   const [activeTab, setActiveTab] = useState('movies');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [viewMode, setViewMode] = useState('grid');
//   const [selectedItem, setSelectedItem] = useState(null);

//   // Filter content based on search term
//   const filterContent = (content) => {
//     return content.filter(item =>
//       item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.genre.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   const filteredMovies = filterContent(movies);
//   const filteredSeries = filterContent(series);

//   // Media card component
//   const MediaCard = ({ item, type }) => (
//     <div 
//       className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
//       onClick={() => setSelectedItem(item)}
//     >
//       <div className="relative">
//         <img
//           src={item.poster}
//           alt={item.title}
//           className="w-full h-64 object-cover"
//         />
//         <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
//           <Play className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300" size={48} />
//         </div>
//         <div className="absolute top-2 right-2 bg-black bg-opacity-70 rounded-full px-2 py-1 flex items-center space-x-1">
//           <Star className="text-yellow-400" size={12} />
//           <span className="text-white text-xs font-semibold">{item.rating}</span>
//         </div>
//       </div>
      
//       <div className="p-4">
//         <h3 className="text-white font-bold text-lg mb-2 truncate">{item.title}</h3>
//         <div className="flex items-center text-gray-400 text-sm mb-2">
//           <Calendar size={14} className="mr-1" />
//           <span className="mr-3">{item.year}</span>
//           {type === 'movie' ? (
//             <>
//               <Clock size={14} className="mr-1" />
//               <span>{item.duration}</span>
//             </>
//           ) : (
//             <>
//               <Tv size={14} className="mr-1" />
//               <span>{item.seasons} seasons, {item.episodes} episodes</span>
//             </>
//           )}
//         </div>
//         <p className="text-gray-300 text-sm mb-3">{item.genre}</p>
//         <p className="text-gray-400 text-xs line-clamp-3">{item.description}</p>
//       </div>
//     </div>
//   );

//   // Modal for selected item
// //   const Modal = ({ item, onClose }) => (
// //     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
// //       <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
// //         <div className="flex">
// //           <img
// //             src={item.poster}
// //             alt={item.title}
// //             className="w-48 h-72 object-cover rounded-l-lg"
// //           />
// //           <div className="p-6 flex-1">
// //             <div className="flex justify-between items-start mb-4">
// //               <h2 className="text-white text-2xl font-bold">{item.title}</h2>
// //               <button
// //                 onClick={onClose}
// //                 className="text-gray-400 hover:text-white text-xl"
// //               >
// //                 ×
// //               </button>
// //             </div>
// //             <div className="space-y-3 text-gray-300">
// //               <div className="flex items-center space-x-4">
// //                 <span className="flex items-center">
// //                   <Star className="text-yellow-400 mr-1" size={16} />
// //                   {item.rating}
// //                 </span>
// //                 <span className="flex items-center">
// //                   <Calendar className="mr-1" size={16} />
// //                   {item.year}
// //                 </span>
// //               </div>
// //               <p className="text-blue-400">{item.genre}</p>
// //               <p className="text-gray-300 leading-relaxed">{item.description}</p>
// //               <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
// //                 <Play size={16} />
// //                 <span>Play</span>
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       {/* Header */}
//       <header className="bg-gray-800 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-8">
//               <h1 className="text-2xl font-bold text-white">MediaFlix</h1>
              
//               {/* Tabs */}
//               <nav className="flex space-x-1">
//                 <button
//                   onClick={() => setActiveTab('movies')}
//                   className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
//                     activeTab === 'movies'
//                       ? 'bg-blue-600 text-white'
//                       : 'text-gray-400 hover:text-white hover:bg-gray-700'
//                   }`}
//                 >
//                   <Film size={18} />
//                   <span>Movies</span>
//                   <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
//                     {filteredMovies.length}
//                   </span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('series')}
//                   className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
//                     activeTab === 'series'
//                       ? 'bg-blue-600 text-white'
//                       : 'text-gray-400 hover:text-white hover:bg-gray-700'
//                   }`}
//                 >
//                   <Tv size={18} />
//                   <span>TV Series</span>
//                   <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
//                     {filteredSeries.length}
//                   </span>
//                 </button>
//               </nav>
//             </div>

//             {/* Search and View Controls */}
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type="text"
//                   placeholder="Search media..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
              
//               <div className="flex bg-gray-700 rounded-lg p-1">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded transition-colors ${
//                     viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-gray-600'
//                   }`}
//                 >
//                   <Grid3X3 size={18} />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded transition-colors ${
//                     viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-gray-600'
//                   }`}
//                 >
//                   <List size={18} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         <div className="mb-6">
//           <h2 className="text-3xl font-bold mb-2">
//             {activeTab === 'movies' ? 'Movies' : 'TV Series'}
//           </h2>
//           <p className="text-gray-400">
//             {activeTab === 'movies' 
//               ? `${filteredMovies.length} movies available`
//               : `${filteredSeries.length} series available`
//             }
//           </p>
//         </div>

//         {/* Media Grid */}
//         <div className={`grid gap-6 ${
//           viewMode === 'grid' 
//             ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
//             : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
//         }`}>
//           {activeTab === 'movies'
//             ? filteredMovies.map(movie => (
//                 <MediaCard key={movie.id} item={movie} type="movie" />
//               ))
//             : filteredSeries.map(series => (
//                 <MediaCard key={series.id} item={series} type="series" />
//               ))
//           }
//         </div>

//         {/* No results message */}
//         {((activeTab === 'movies' && filteredMovies.length === 0) ||
//           (activeTab === 'series' && filteredSeries.length === 0)) && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-lg">
//               {searchTerm 
//                 ? `No ${activeTab} found matching "${searchTerm}"`
//                 : `No ${activeTab} available`
//               }
//             </div>
//           </div>
//         )}
//       </main>

//       {/* Modal */}
//       {/* {selectedItem && (
//         <Modal
//           item={selectedItem}
//           onClose={() => setSelectedItem(null)}
//         />
//       )} */}
//     </div>
//   );
// };

// export default Activity;
