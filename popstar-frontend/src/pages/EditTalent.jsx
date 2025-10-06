import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, TALENT_ENDPOINT } from "../config";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditTalent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [talent, setTalent] = useState({
    name: "",
    category: "",
    pricePerHour: "",
    email: "",
    phone: "",
    imageFile: null,
    existingImageUrl: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchTalent = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `${TALENT_ENDPOINT}/${id}`,
          { signal: controller.signal }
        );

        if (!isMounted) {
          return;
        }

        setTalent({
          name: response.data.name ?? "",
          category: response.data.category ?? "",
          pricePerHour: response.data.pricePerHour ?? "",
          email: response.data.email ?? "",
          phone: response.data.phone ?? "",
          imageFile: null,
          existingImageUrl: response.data.imageUrl ?? "",
        });
        setErrorMessage("");
      } catch (error) {
        if (!isMounted || axios.isCancel(error)) {
          return;
        }

        console.error("Error fetching talent:", error);
        setErrorMessage(
          "We could not load the talent profile. Please try again."
        );
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
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTalent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setTalent((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!talent.email.trim() && !talent.phone.trim()) {
      setErrorMessage("Add at least an email address or phone number.");
      return;
    }

    const formData = new FormData();
    formData.append("name", talent.name.trim());
    formData.append("category", talent.category);
    formData.append("pricePerHour", talent.pricePerHour);
    formData.append("email", talent.email.trim());
    formData.append("phone", talent.phone.trim());

    if (talent.imageFile) {
      formData.append("imageFile", talent.imageFile);
    }

    try {
      setIsSubmitting(true);
      await axios.put(`${TALENT_ENDPOINT}/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (error) {
      console.error("Error updating talent:", error);
      setErrorMessage(
        "Unable to update the talent profile. Review the fields and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="form-section">
        <p className="status-message" role="status">
          Loading talent profile...
        </p>
      </section>
    );
  }

  return (
    <section className="form-section" aria-labelledby="edit-talent-title">
      <div className="section-heading">
        <div>
          <h1 className="section-heading__title" id="edit-talent-title">
            Update talent profile
          </h1>
          <p className="section-heading__meta">
            Adjust the key details, change the hourly rate, or refresh the portfolio image.
          </p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="name">
              Talent name
            </label>
            <input
              id="name"
              name="name"
              className="input-control"
              value={talent.name}
              onChange={handleChange}
              required
              maxLength={80}
              autoComplete="name"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="category">
              Primary expertise
            </label>
            <select
              id="category"
              name="category"
              className="input-control"
              value={talent.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a service</option>
              <option value="Photographer">Photographer</option>
              <option value="DJ / MC">DJ / MC</option>
              <option value="Graphic Designer">Graphic Designer</option>
              <option value="Event Stylist">Event Stylist</option>
              <option value="Videographer">Videographer</option>
              <option value="Live Musician">Live Musician</option>
              <option value="Lighting Technician">Lighting Technician</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="pricePerHour">
              Hourly rate (NOK)
            </label>
            <input
              id="pricePerHour"
              name="pricePerHour"
              type="number"
              inputMode="decimal"
              min="0"
              className="input-control"
              value={talent.pricePerHour}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="email">
              Contact email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="input-control"
              value={talent.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="phone">
              Contact phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="input-control"
              value={talent.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            <p className="form-hint">Optional fallback if you prefer calls or texts.</p>
          </div>

          {talent.existingImageUrl && (
            <div className="form-field">
              <span className="form-label">Current portfolio cover</span>
              <img
                src={`${API_BASE_URL}/${talent.existingImageUrl}`}
                alt={`Current promotional photo for ${talent.name}`}
                className="preview-image"
              />
            </div>
          )}

          <div className="form-field">
            <label className="form-label" htmlFor="imageFile">
              Upload new photo (optional)
            </label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              className="input-control"
              onChange={handleFileChange}
            />
            <p className="form-hint">
              Uploading a new photo will replace the existing one.
            </p>
          </div>
        </div>

        <div aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <p className="status-message status-message--error" role="alert">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="form-actions">
          <Link to="/" className="button button--ghost">
            Cancel
          </Link>
          <button
            type="submit"
            className="button button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditTalent;








