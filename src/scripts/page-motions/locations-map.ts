import { gsap, prefersReducedMotion } from "../gsap-init";
import { BranchMapController, type MapBranch } from "../branch-map";
import { distanceKm } from "../../data/branches";
import { createPageMotion } from "./utils";

type BranchPayload = {
  id: string;
  name: string;
  region: string;
  address: string;
  hours: string;
  phone: string;
  mapsUrl: string;
  image: string;
  lat: number;
  lng: number;
};

function parseBranch(el: HTMLElement): BranchPayload | null {
  try {
    return JSON.parse(el.dataset.branch ?? "") as BranchPayload;
  } catch {
    return null;
  }
}

function formatKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km away`;
}

function parseMapBranches(container: HTMLElement): MapBranch[] {
  try {
    return JSON.parse(container.dataset.branches ?? "[]") as MapBranch[];
  } catch {
    return [];
  }
}

export const locationsMotion = createPageMotion((root) => {
  const mapEl = root.querySelector<HTMLElement>("[data-branch-map]");
  const live = root.querySelector<HTMLElement>("[data-branch-status]");
  const cards = [...root.querySelectorAll<HTMLElement>("[data-branch-list-item]")];
  const searchInput = root.querySelector<HTMLInputElement>("[data-branch-search]");
  const emptyEl = root.querySelector<HTMLElement>("[data-branch-empty]");
  const findNearestBtn = root.querySelector<HTMLButtonElement>("[data-find-nearest]");
  const findNearestLabel = root.querySelector<HTMLElement>("[data-find-nearest-label]");
  const list = root.querySelector<HTMLElement>("[data-branch-list]");

  if (!mapEl || !cards.length) return;

  const mapBranches = parseMapBranches(mapEl);
  let map: BranchMapController | null = null;
  let selectedId =
    cards.find((c) => c.classList.contains("is-expanded"))?.dataset.branchId ??
    mapBranches[0]?.id ??
    "";

  const initMap = () => {
    map?.destroy();
    map = new BranchMapController(mapEl, mapBranches);
    map.onSelect = (id) => setSelected(id, true, { scrollIntoView: true });
    requestAnimationFrame(() => map?.invalidateSize());
  };

  initMap();

  const setExpanded = (id: string, expand: boolean) => {
    const card = root.querySelector<HTMLElement>(`[data-branch-list-item][data-branch-id="${id}"]`);
    if (!card) return;

    const details = card.querySelector<HTMLElement>("[data-branch-details]");
    const toggle = card.querySelector<HTMLButtonElement>("[data-branch-toggle]");
    const inner = card.querySelector<HTMLElement>(".branch-card__details-inner");

    card.classList.toggle("is-expanded", expand);
    card.setAttribute("aria-expanded", String(expand));
    toggle?.setAttribute("aria-expanded", String(expand));

    if (!details) return;

    if (expand) {
      details.hidden = false;
      if (!prefersReducedMotion() && inner) {
        gsap.fromTo(
          inner,
          { autoAlpha: 0, y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
        );
      }
    } else {
      details.hidden = true;
    }
  };

  const setSelected = (id: string, animate = true, opts?: { scrollIntoView?: boolean }) => {
    selectedId = id;
    const cardEl = root.querySelector<HTMLElement>(`[data-branch-list-item][data-branch-id="${id}"]`);
    const branch = cardEl ? parseBranch(cardEl) : null;
    if (!branch) return;

    cards.forEach((card) => {
      const active = card.dataset.branchId === id;
      setExpanded(card.dataset.branchId ?? "", active);
    });

    map?.select(id, animate && !prefersReducedMotion());

    if (live) live.textContent = `Showing ${branch.name}`;

    if (opts?.scrollIntoView) {
      cardEl?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" });
    }
  };

  const onToggle = (event: Event) => {
    const toggle = event.currentTarget as HTMLButtonElement;
    const card = toggle.closest<HTMLElement>("[data-branch-list-item]");
    const id = card?.dataset.branchId;
    if (!id) return;

    if (selectedId === id && card?.classList.contains("is-expanded")) {
      setExpanded(id, false);
      selectedId = "";
      if (live) live.textContent = "";
      return;
    }

    setSelected(id);
  };

  const applySearch = () => {
    const q = (searchInput?.value ?? "").trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const hay = card.dataset.searchText ?? "";
      const show = !q || hay.includes(q);
      const row = card.closest<HTMLElement>("[role='listitem']") ?? card;
      row.hidden = !show;
      if (show) visible += 1;
    });

    if (emptyEl) {
      emptyEl.hidden = visible > 0;
      emptyEl.classList.toggle("hidden", visible > 0);
    }
  };

  const clearDistances = () => {
    cards.forEach((card) => {
      const el = card.querySelector<HTMLElement>("[data-branch-distance]");
      if (el) {
        el.hidden = true;
        el.textContent = "";
      }
    });
  };

  const showDistances = (user: { lat: number; lng: number }) => {
    const scored = cards
      .map((card) => {
        const b = parseBranch(card);
        if (!b) return null;
        return { card, id: b.id, km: distanceKm(user, b) };
      })
      .filter((x): x is { card: HTMLElement; id: string; km: number } => Boolean(x))
      .sort((a, b) => a.km - b.km);

    scored.forEach(({ card, km }, i) => {
      const el = card.querySelector<HTMLElement>("[data-branch-distance]");
      if (!el) return;
      el.hidden = false;
      el.textContent = i === 0 ? `Nearest · ${formatKm(km)}` : formatKm(km);
    });

    if (list) {
      scored.forEach(({ card }) => {
        const row = card.closest<HTMLElement>("[role='listitem']") ?? card;
        list.appendChild(row);
      });
    }

    map?.showUser(user.lat, user.lng);
    return scored[0]?.id ?? null;
  };

  const onFindNearest = () => {
    if (!navigator.geolocation) {
      if (live) live.textContent = "Location is not supported in this browser.";
      return;
    }

    findNearestBtn?.setAttribute("disabled", "true");
    if (findNearestLabel) findNearestLabel.textContent = "Locating…";
    if (live) live.textContent = "Getting your location…";

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        findNearestBtn?.removeAttribute("disabled");
        if (findNearestLabel) findNearestLabel.textContent = "Find nearest";

        const user = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const nearestId = showDistances(user);
        if (nearestId) {
          if (searchInput) searchInput.value = "";
          applySearch();
          setSelected(nearestId, true, { scrollIntoView: true });
          const nearestCard = root.querySelector<HTMLElement>(
            `[data-branch-list-item][data-branch-id="${nearestId}"]`,
          );
          const nearest = nearestCard ? parseBranch(nearestCard) : null;
          if (live && nearest) live.textContent = `Nearest branch: ${nearest.name}`;
        }
      },
      (err) => {
        findNearestBtn?.removeAttribute("disabled");
        if (findNearestLabel) findNearestLabel.textContent = "Find nearest";
        clearDistances();
        if (live) {
          live.textContent =
            err.code === err.PERMISSION_DENIED
              ? "Location permission denied — enable it to find the nearest branch."
              : "Could not get your location. Try again.";
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  };

  cards.forEach((card) => {
    const toggle = card.querySelector<HTMLButtonElement>("[data-branch-toggle]");
    toggle?.addEventListener("click", onToggle);
  });
  searchInput?.addEventListener("input", applySearch);
  findNearestBtn?.addEventListener("click", onFindNearest);

  setSelected(selectedId, false);

  return () => {
    cards.forEach((card) => {
      const toggle = card.querySelector<HTMLButtonElement>("[data-branch-toggle]");
      toggle?.removeEventListener("click", onToggle);
    });
    searchInput?.removeEventListener("input", applySearch);
    findNearestBtn?.removeEventListener("click", onFindNearest);
    map?.destroy();
    map = null;
  };
});
