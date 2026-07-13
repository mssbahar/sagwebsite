import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapBranch = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

function markerIcon(active = false) {
  return L.divIcon({
    className: "branch-map-marker",
    html: `<span class="branch-map-marker__dot${active ? " is-active" : ""}"></span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export class BranchMapController {
  private map: L.Map;
  private markers = new Map<string, L.Marker>();
  private userMarker: L.CircleMarker | null = null;
  private selectedId = "";
  onSelect?: (id: string) => void;

  constructor(container: HTMLElement, branches: MapBranch[]) {
    this.map = L.map(container, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(this.map);

    const points = branches.map((b) => L.latLng(b.lat, b.lng));
    const bounds = L.latLngBounds(points);

    branches.forEach((b) => {
      const marker = L.marker([b.lat, b.lng], { icon: markerIcon() })
        .addTo(this.map)
        .bindTooltip(b.name, {
          direction: "top",
          offset: [0, -10],
          className: "branch-map-tooltip",
        });

      marker.on("click", () => this.onSelect?.(b.id));
      this.markers.set(b.id, marker);
    });

    this.map.fitBounds(bounds, { padding: [48, 48], maxZoom: 11 });
  }

  select(id: string, animate = true) {
    if (this.selectedId === id && animate) return;
    this.selectedId = id;

    this.markers.forEach((marker, branchId) => {
      marker.setIcon(markerIcon(branchId === id));
      if (branchId === id) marker.setZIndexOffset(1000);
      else marker.setZIndexOffset(0);
    });

    const marker = this.markers.get(id);
    if (!marker) return;

    const latlng = marker.getLatLng();
    if (animate) {
      this.map.flyTo(latlng, Math.max(this.map.getZoom(), 13), { duration: 1.1 });
    } else {
      this.map.setView(latlng, Math.max(this.map.getZoom(), 13), { animate: false });
    }
  }

  showUser(lat: number, lng: number) {
    const point = L.latLng(lat, lng);
    if (!this.userMarker) {
      this.userMarker = L.circleMarker(point, {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: "#3b82f6",
        fillOpacity: 0.95,
      }).addTo(this.map);
    } else {
      this.userMarker.setLatLng(point);
    }
  }

  invalidate() {
    this.map.invalidateSize();
  }

  destroy() {
    this.map.remove();
    this.markers.clear();
    this.userMarker = null;
  }
}
