"""
Mock Demo Service - Exact replica of real backend data structures
"""
from typing import Dict, List, Any
import json
from datetime import datetime, timedelta

class MockDemoService:
    def __init__(self):
        # Maestro demos - exact structure from real backend
        self.maestro_demos = [
            {
                "id": "maestro1",
                "title": "Product Overview Demo",
                "created_at": "2024-01-15T10:00:00Z",
                "last_modified_at": "2024-01-20T14:30:00Z",
                "replay_folder_id": "folder1",
                "properties": json.dumps({
                    "replay_id": "maestro1",
                    "replay_title": "Product Overview Demo",
                    "tags": ["marketing", "product"],
                    "share_with_all": False,
                    "share_as_play_only": True
                }),
                "created_by_id": "user1",
                "created_by_username": "john.doe",
                "poster_image": "",
                "is_playing": False,
                "is_editing": False,
                "play_count": 45,
                "transformations": [],
                "resources": [],
                "interception_rules": [],
                "data_sets": []
            },
            {
                "id": "maestro2",
                "title": "Sales Process Demo",
                "created_at": "2024-01-16T09:00:00Z",
                "last_modified_at": "2024-01-21T11:15:00Z",
                "replay_folder_id": "folder2",
                "properties": json.dumps({
                    "replay_id": "maestro2",
                    "replay_title": "Sales Process Demo",
                    "tags": ["sales", "process"],
                    "share_with_all": True,
                    "share_as_play_only": False
                }),
                "created_by_id": "user2",
                "created_by_username": "jane.smith",
                "poster_image": "",
                "is_playing": False,
                "is_editing": False,
                "play_count": 23,
                "transformations": [],
                "resources": [],
                "interception_rules": [],
                "data_sets": []
            }
        ]

        # Legacy demos - exact structure from merged_replay_list endpoint
        self.legacy_demos = [
            {
                "id": "legacy1",
                "api_version": 3,
                "title": "Legacy Product Demo",
                "last_modified_at": "2024-01-18T16:45:00Z",
                "created_at": "2024-01-10T08:00:00Z",
                "properties": json.dumps({"legacy": True}),
                "replay_type": "LEGACY",
                "acl": None,
                "created_by": "user1",
                "replay_folder_index": 1,
                "starting_snapshot_id": "snapshot1",
                "replay_folder_id": "folder1",
                "folder_id": "folder1",
                "folder_title": "Marketing Demos",
                "owner_display_name": "john.doe",
                "owner_first_name": "John",
                "owner_last_name": "Doe",
                "snapshot_count": 12,
                "only_edit4": False,
                "screenshot_small": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                "custom_links": {
                    "link1": {
                        "title": "Product Overview",
                        "url": "https://demo.example.com/legacy1/overview",
                        "description": "Main product overview page",
                        "is_active": True
                    },
                    "link2": {
                        "title": "Pricing",
                        "url": "https://demo.example.com/legacy1/pricing",
                        "description": "Pricing information",
                        "is_active": True
                    }
                }
            },
            {
                "id": "legacy2",
                "api_version": 3,
                "title": "Legacy Sales Demo",
                "last_modified_at": "2024-01-19T10:20:00Z",
                "created_at": "2024-01-12T14:00:00Z",
                "properties": json.dumps({"legacy": True}),
                "replay_type": "LEGACY",
                "acl": None,
                "created_by": "user2",
                "replay_folder_index": 2,
                "starting_snapshot_id": "snapshot2",
                "replay_folder_id": "folder2",
                "folder_id": "folder2",
                "folder_title": "Sales Demos",
                "owner_display_name": "jane.smith",
                "owner_first_name": "Jane",
                "owner_last_name": "Smith",
                "snapshot_count": 8,
                "only_edit4": False,
                "screenshot_small": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                "custom_links": {
                    "link1": {
                        "title": "Sales Process",
                        "url": "https://demo.example.com/legacy2/sales",
                        "description": "Sales process walkthrough",
                        "is_active": True
                    }
                }
            }
        ]

        # Live demos - exact structure from merged_replay_list live_replays
        self.live_demos = [
            {
                "id": "live1",
                "title": "Live Interactive Demo",
                "created_at": "2024-01-17T11:00:00Z",
                "last_modified_at": "2024-01-22T09:30:00Z",
                "acl": None,
                "folder_id": "folder1",
                "folder_title": "Marketing Demos",
                "owner_first_name": "John",
                "owner_last_name": "Doe",
                "default_url": "https://demo.example.com/live1",
                "active_link_count": 3,
                "last_session_at": "2024-01-22T08:45:00Z",
                "screenshot_small": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            },
            {
                "id": "live2",
                "title": "Live Sales Demo",
                "created_at": "2024-01-18T15:00:00Z",
                "last_modified_at": "2024-01-23T12:15:00Z",
                "acl": None,
                "folder_id": "folder2",
                "folder_title": "Sales Demos",
                "owner_first_name": "Jane",
                "owner_last_name": "Smith",
                "default_url": "https://demo.example.com/live2",
                "active_link_count": 5,
                "last_session_at": "2024-01-23T11:30:00Z",
                "screenshot_small": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
            }
        ]

    def get_maestro_replays(self) -> Dict[str, Any]:
        """Mock Maestro replay list - exact structure from real backend"""
        return {
            "success": True,
            "replays": self.maestro_demos
        }

    def get_merged_replay_list(self) -> Dict[str, Any]:
        """Mock r/merged_replay_list/ endpoint - exact structure from real backend"""
        return {
            "replays": self.legacy_demos,
            "live_replays": self.live_demos
        }

    def get_published_live_demo_list(self) -> Dict[str, Any]:
        """Mock r/published_live_demo_list/ endpoint - exact structure from real backend"""
        published_live_demos = []
        for demo in self.live_demos:
            published_demo = demo.copy()
            published_demo.update({
                "replay_id": demo["id"],
                "is_pending": False,
                "properties": json.dumps({"live": True}),
                "screenshot_small": demo.get("screenshot_small", ""),
                "replay_folder_index": 1,
                "replay_title": demo["title"],
                "created_by": "user1",
                "created_by_username": "john.doe",
                "created_by_first_name": "John",
                "created_by_last_name": "Doe",
                "replay_created_by_id": "user1",
                "folder_acl": None
            })
            published_live_demos.append(published_demo)

        return {
            "published_live_demos": published_live_demos
        }

    def get_default_url(self, demo_id: str) -> Dict[str, Any]:
        """Mock r/default_url/{id}/ endpoint - exact structure from real backend"""
        # Find demo and return its URL
        for demo in self.legacy_demos + self.live_demos:
            if demo["id"] == demo_id:
                return {
                    "default_url": demo.get("default_url", f"https://demo.example.com/{demo_id}")
                }
        
        return {
            "default_url": f"https://demo.example.com/{demo_id}"
        }
