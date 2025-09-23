"""
Mock Folder Service - Exact replica of real backend data structures
"""
from typing import Dict, List, Any
import json
from datetime import datetime

class MockFolderService:
    def __init__(self):
        # Exact structure from real backend folders_helper.py
        self.folders = [
            {
                "id": "folder1",
                "title": "Marketing Demos",
                "sort_index": 1,
                "archived": False,
                "acl": None,  # Optional field
                "ac_replay_count": 5,  # Maestro demos count
                "sc_replay_count": 3,  # Legacy demos count
                "created_by": "user1"
            },
            {
                "id": "folder2", 
                "title": "Sales Demos",
                "sort_index": 2,
                "archived": False,
                "acl": None,
                "ac_replay_count": 8,
                "sc_replay_count": 2,
                "created_by": "user1"
            },
            {
                "id": "folder3",
                "title": "Training",
                "sort_index": 3,
                "archived": False,
                "acl": None,
                "ac_replay_count": 12,
                "sc_replay_count": 6,
                "created_by": "user2"
            }
        ]

    def get_folders_list(self) -> Dict[str, Any]:
        """Mock r/folder_list/ endpoint - exact structure from real backend"""
        return {
            "folders": self.folders,
            "apps": []  # Optional field from real backend
        }

    def get_all_folders_list(self) -> Dict[str, Any]:
        """Mock comprehensive folder endpoint with type annotations"""
        all_folders = []
        
        # Add Maestro folders (ReplayFolder)
        for folder in self.folders:
            folder_copy = folder.copy()
            folder_copy['type'] = 'maestro'
            folder_copy['demo_count'] = folder_copy.get('ac_replay_count', 0)
            all_folders.append(folder_copy)
        
        # Add Legacy demo folders (PublishedReplayFolder)
        for folder in self.folders:
            folder_copy = folder.copy()
            folder_copy['type'] = 'legacy'
            folder_copy['demo_count'] = folder_copy.get('sc_replay_count', 0)
            all_folders.append(folder_copy)
        
        # Add Live demo folders (PublishedReplayFolder for live demos)
        for folder in self.folders:
            folder_copy = folder.copy()
            folder_copy['type'] = 'live'
            folder_copy['demo_count'] = folder_copy.get('ac_replay_count', 0)  # Live demos use same count
            all_folders.append(folder_copy)
        
        return {
            "folders": all_folders,
            "total_count": len(all_folders)
        }
