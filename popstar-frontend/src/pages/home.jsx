import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL, TALENT_ENDPOINT } from "../config";

function Home() {
  const [talentProfiles, setTalentProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchTalent = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(TALENT_ENDPOINT, {
          signal: controller.signal,
        });

        if (!isMounted) {
          return;
        }

        setTalentProfiles(response.data);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted || axios.isCancel(error)) {
          return;
        }

        console.error("Error fetching talent:", error);
        setErrorMessage("Could not load talent profiles. Please try again shortly.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTalent();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const filteredTalent = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return talentProfiles;
    }

    return talentProfiles.filter((profile) =>
      profile.name.toLowerCase().includes(query)
    );
  }, [talentProfiles, searchQuery]);

  const resultCountLabel =
    filteredTalent.length === 1
      ? "1 profile"
      : `${filteredTalent.length} profiles`;
  const showEmptyState =
    !isLoading && !errorMessage && filteredTalent.length === 0;

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat("nb-NO", {
        style: "currency",
        currency: "NOK",
        maximumFractionDigits: 0,
      }),
    []
  );

  const totalProfiles = talentProfiles.length;

  const distinctServices = useMemo(() => {
    const categories = new Set(
      talentProfiles
        .map((profile) => profile.category?.trim())
        .filter((category) => Boolean(category))
    );
    return categories.size;
  }, [talentProfiles]);

  const averageRate = useMemo(() => {
    if (!totalProfiles) {
      return 0;
    }

    const sum = talentProfiles.reduce(
      (accumulator, profile) => accumulator + Number(profile.pricePerHour || 0),
      0
    );

    return Math.round(sum / totalProfiles);
  }, [talentProfiles, totalProfiles]);

  const handleDelete = async (id, name) => {
    if (deletingId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${name}'s profile?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(`${TALENT_ENDPOINT}/${id}`);
      setTalentProfiles((prev) => prev.filter((profile) => profile.id !== id));
      setErrorMessage("");
    } catch (error) {
      console.error("Error deleting talent profile:", error);
      setErrorMessage("Unable to delete the talent profile. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <section className="page-header">
        <h1 className="page-header__title">
          Discover freelance talent for your next project or event
        </h1>
        <p className="page-header__lead">
          Browse vetted creatives and event specialists, filter by name, and
          shortlist the perfect match for your brief.
        </p>
      </section>

      <section className="insights" aria-label="Marketplace insights">
        <div className="insights-grid">
          <article className="insight-card">
            <span className="insight-card__value">{totalProfiles}</span>
            <span className="insight-card__label">Active profiles</span>
          </article>
          <article className="insight-card">
            <span className="insight-card__value">{distinctServices}</span>
            <span className="insight-card__label">Distinct services</span>
          </article>
          <article className="insight-card">
            <span className="insight-card__value">
              {totalProfiles ? priceFormatter.format(averageRate) : "--"}
            </span>
            <span className="insight-card__label">Average hourly rate</span>
          </article>
        </div>
      </section>

      <section className="search-panel" aria-labelledby="search-title">
        <div className="search-panel__header">
          <h2 className="search-panel__title" id="search-title">
            Fine-tune your search
          </h2>
          <p className="search-panel__hint">
            Search by name or service to filter the list instantly.
          </p>
        </div>

        <form
          className="search-form"
          role="search"
          aria-label="Search talent by name or skill"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="search-bar">
            <label className="sr-only" htmlFor="search">
              Search talent by name or skill
            </label>
            <input
              id="search"
              type="search"
              className="input-control search-input"
              placeholder="Search by name or specialty..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              autoComplete="off"
            />

            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>
      </section>

      <section aria-labelledby="results-title">
        <div className="section-heading">
          <h2 className="section-heading__title" id="results-title">
            Available talent
          </h2>
          <span className="section-heading__meta">{resultCountLabel}</span>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {isLoading && (
            <p className="status-message" role="status">
              Loading talent profiles...
            </p>
          )}

          {!isLoading && errorMessage && (
            <p className="status-message status-message--error" role="alert">
              {errorMessage}
            </p>
          )}
        </div>

        {showEmptyState && (
          <p className="empty-state">
            No talent profiles match your search yet. Adjust the filters or add a
            new profile.
          </p>
        )}

        {!isLoading && !errorMessage && filteredTalent.length > 0 && (
          <ul className="card-grid" aria-label="Talent directory">
            {filteredTalent.map((profile) => {
              const imageSrc = profile.imageUrl
                ? `${API_BASE_URL}/${profile.imageUrl}`
                : "";
              const initials =
                (profile.name || "")
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "FT";

              const email = profile.email?.trim() ?? "";
              const phone = profile.phone?.trim() ?? "";
              const sanitizedPhone = phone.replace(/[^+\d]/g, "");

              const bookingHref = email
                ? `mailto:${email}?subject=${encodeURIComponent(
                    `Booking request for ${profile.name}`
                  )}`
                : phone
                ? `tel:${sanitizedPhone}`
                : null;

              return (
                <li key={profile.id}>
                  <article className="talent-card">
                    <figure className="talent-card__media">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={`Portrait of ${profile.name}`}
                          className="talent-card__image"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="talent-card__placeholder"
                          role="img"
                          aria-label={`Portfolio placeholder for ${profile.name}`}
                        >
                          {initials}
                        </div>
                      )}
                    </figure>
                    <div className="talent-card__body">
                      <h3 className="talent-card__name">{profile.name}</h3>
                      <div className="talent-card__meta">
                        <span>
                          <strong>Expertise:</strong> {profile.category}
                        </span>
                        <span className="talent-card__price">
                          {priceFormatter.format(
                            Number(profile.pricePerHour) || 0
                          )}{" "}
                          avg. hourly rate
                        </span>
                      </div>

                      {(email || phone) && (
                        <div className="talent-card__contact">
                          {email && (
                            <a
                              className="contact-link"
                              href={`mailto:${email}`}
                              aria-label={`Email ${profile.name}`}
                            >
                              {email}
                            </a>
                          )}
                          {phone && (
                            <a
                              className="contact-link"
                              href={`tel:${sanitizedPhone}`}
                              aria-label={`Call ${profile.name}`}
                            >
                              {phone}
                            </a>
                          )}
                        </div>
                      )}

                      <div className="talent-card__actions">
                        {bookingHref && (
                          <a
                            className="button button--primary"
                            href={bookingHref}
                            aria-label={`Book ${profile.name}`}
                          >
                            Book Now
                          </a>
                        )}
                        <Link
                          to={`/edit/${profile.id}`}
                          className="button button--ghost"
                          aria-label={`Edit ${profile.name}'s profile`}
                        >
                          Edit profile
                        </Link>
                        <button
                          type="button"
                          className="button button--danger"
                          onClick={() => handleDelete(profile.id, profile.name)}
                          disabled={deletingId === profile.id}
                        >
                          {deletingId === profile.id ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

export default Home;



