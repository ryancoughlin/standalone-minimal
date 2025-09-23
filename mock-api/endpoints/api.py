"""
Mock API Endpoints - Exact replica of real backend endpoints
"""
from typing import Dict, Any
import json
from services.folder_service import MockFolderService
from services.demo_service import MockDemoService

class MockAPIEndpoints:
    def __init__(self):
        self.folder_service = MockFolderService()
        self.demo_service = MockDemoService()

    def handle_request(self, path: str, method: str = "GET", data: Dict = None) -> Dict[str, Any]:
        """Route requests to appropriate mock services with exact backend structure"""
        
        # Remove leading slash for consistent matching
        clean_path = path.lstrip('/')
        
        if clean_path == "r/folder_list/":
            return self.folder_service.get_folders_list()
        
        elif clean_path == "r/all_folders_list/":
            return self.folder_service.get_all_folders_list()
        
        elif clean_path == "r/merged_replay_list/":
            return self.demo_service.get_merged_replay_list()
        
        elif clean_path == "r/published_live_demo_list/":
            return self.demo_service.get_published_live_demo_list()
        
        elif clean_path.startswith("r/default_url/") and clean_path.endswith("/"):
            demo_id = clean_path.split("/")[-2]  # Extract ID from path
            return self.demo_service.get_default_url(demo_id)
        
        elif clean_path == "r/replay_list/":
            return self.demo_service.get_maestro_replays()
        
        else:
            return {
                "error": f"Unknown endpoint: {path}",
                "available_endpoints": [
                    "r/folder_list/",
                    "r/all_folders_list/",
                    "r/merged_replay_list/",
                    "r/published_live_demo_list/",
                    "r/default_url/{id}/",
                    "r/replay_list/"
                ]
            }

# Global instance for easy access
mock_api = MockAPIEndpoints()
