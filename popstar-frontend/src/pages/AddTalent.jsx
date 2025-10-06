import { useState } from "react";
import axios from "axios";
import { TALENT_ENDPOINT } from "../config";
import { Link, useNavigate } from "react-router-dom";

const AddTalent = () => {
  const [talent, setTalent] = useState({
    name: "",
    category: "",
    pricePerHour: "",
    email: "",
    phone: "",
    imageFile: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

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

    if (!talent.imageFile) {
      setErrorMessage("Upload a portfolio image before continuing.");
      return;
    }

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
    formData.append("imageFile", talent.imageFile);

    try {
      setIsSubmitting(true);
      await axios.post(TALENT_ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (error) {
      console.error("Error adding talent:", error);
      setErrorMessage(
        "Could not save the talent profile. Review the fields and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-section" aria-labelledby="add-talent-title">
      <div className="section-heading">
        <div>
          <h1 className="section-heading__title" id="add-talent-title">
            Add a new talent profile
          </h1>
          <p className="section-heading__meta">
            Provide the specialist's name, expertise, hourly rate, and a hero photo.
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
              placeholder="For example: Maya Lindberg"
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
              placeholder="How much does the service cost per hour?"
              value={talent.pricePerHour}
              onChange={handleChange}
              required
            />
            <p className="form-hint">Enter the amount without currency symbols.</p>
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
              placeholder="For example: bookings@mayalindberg.com"
              value={talent.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <p className="form-hint">
              Shown on the talent card, powers automated Book Now emails, and counts toward the contact requirement (add email or phone).
            </p>
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
              placeholder="For example: +47 400 00 000"
              value={talent.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            <p className="form-hint">Optional fallback if you prefer calls or texts.</p>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="imageFile">
              Portfolio cover photo
            </label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              className="input-control"
              onChange={handleFileChange}
              required
            />
            <p className="form-hint">
              Upload a high-resolution image (JPEG or PNG preferred).
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
            {isSubmitting ? "Saving..." : "Save talent profile"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddTalent;






