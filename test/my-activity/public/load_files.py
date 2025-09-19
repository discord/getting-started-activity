import os
import json
from datetime import datetime
from pathlib import Path

def generate_plex_style_listing(directory_path, output_file=None):
    """Generate a Plex-style JSON listing of files in a directory"""
    
    files_list = []
    
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            file_stat = os.stat(file_path)
            
            # Get relative path from the base directory
            rel_path = os.path.relpath(file_path, directory_path)
            
            file_info = {
                "name": file,
                "path": rel_path,
                "full_path": file_path,
                "size": file_stat.st_size,
                "modified": datetime.fromtimestamp(file_stat.st_mtime).isoformat(),
                "created": datetime.fromtimestamp(file_stat.st_ctime).isoformat(),
                "extension": Path(file).suffix.lower(),
                "type": "file"
            }
            
            # Add media-specific info if it's a video/audio file
            media_extensions = {'.mp4', '.mkv', '.avi', '.mov', '.m4v', '.mp3', '.flac', '.wav'}
            if file_info["extension"] in media_extensions:
                file_info["media_type"] = "video" if file_info["extension"] in {'.mp4', '.mkv', '.avi', '.mov', '.m4v'} else "audio"
            
            files_list.append(file_info)
    
    # Sort by name
    files_list.sort(key=lambda x: x["name"].lower())
    
    result = {
        "directory": directory_path,
        "total_files": len(files_list),
        "generated": datetime.now().isoformat(),
        "files": files_list
    }
    
    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2, ensure_ascii=False)
    
    return result

# Usage
if __name__ == "__main__":
    directory = "./videos/Media/Movies"
    listing = generate_plex_style_listing(directory, "media_listing.json")
    print(f"Generated listing with {listing['total_files']} files")