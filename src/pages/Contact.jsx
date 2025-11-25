import React, { useState } from "react";
import "./Contact.css";
import { FaFacebookF, FaInstagram, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

// Pagina de contact completă: informații, formular, hartă, FAQ și linkuri sociale.
export default function Contact() {
	const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
	const [errors, setErrors] = useState({});
	const [sent, setSent] = useState(false);
	const [openFaq, setOpenFaq] = useState(null);
	const [loading, setLoading] = useState(false);
	const [serverError, setServerError] = useState(null);

	const faqs = [
		{ q: "Cât timp durează livrarea?", a: "Timpul de livrare depinde de produs și de stoc. De obicei, livrăm în 3-14 zile lucrătoare. Pentru informații exacte, te rugăm să ne contactezi." },
		{ q: "Oferiți garanție?", a: "Da — oferim garanție pentru majoritatea utilajelor. Durata garanției variază în funcție de produs; verifică fișa produsului sau contactează-ne." },
		{ q: "Pot cere demonstrație produs?", a: "Da. Contactează-ne cu modelul dorit și îți vom programa o demonstrație sau consultanță tehnică." },
	];

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((s) => ({ ...s, [name]: value }));
	}

	function validate() {
		const err = {};
		if (!form.name.trim()) err.name = "Completează numele.";
		if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) err.email = "Introdu o adresă de email validă.";
		if (!form.message.trim()) err.message = "Scrie un mesaj scurt.";
		return err;
	}

	function handleSubmit(e) {
		e.preventDefault();
		const v = validate();
		setErrors(v);
		if (Object.keys(v).length === 0) {
			// Trimitem către backendul local dacă este disponibil
			setErrors({});
			setServerError(null);
			setLoading(true);
			(async () => {
				try {
					const res = await fetch("http://localhost:4000/api/messages", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							name: form.name.trim(),
							email: form.email.trim(),
							phone: form.phone.trim(),
							message: form.message.trim(),
							source: "contact-page",
						}),
					});

					const data = await res.json().catch(() => null);
					if (!res.ok) {
						const msg = (data && data.error) || `Server returned ${res.status}`;
						setServerError(msg);
						setLoading(false);
						return;
					}

					// success
					setSent(true);
					setForm({ name: "", email: "", phone: "", message: "" });
					setTimeout(() => setSent(false), 6000);
				} catch (err) {
					console.error("Failed to send message", err);
					setServerError("Nu am putut trimite mesajul. Încearcă din nou mai târziu.");
				} finally {
					setLoading(false);
				}
			})();
		}
	}

	return (
		<div className="contact-page container">
			<header className="contact-hero">
				<h1>Contactează HANWO România — Suntem aici pentru tine</h1>
				<p className="lead">Ai o întrebare despre produse, service sau livrare? Trimite-ne un mesaj și îți răspundem rapid.</p>
			</header>

			<div className="contact-grid">
				<aside className="contact-info">
					<div className="info-card">
						<div className="icon"><FaPhone /></div>
						<div>
							<h3>Telefon</h3>
							<p><a href="tel:+40745123456">+40 741 220 030</a></p>
						</div>
					</div>

					<div className="info-card">
						<div className="icon"><FaEnvelope /></div>
						<div>
							<h3>Email</h3>
							<p><a href="mailto:contact@hanwo.ro">agrorus.brend@gmail.com</a></p>
						</div>
					</div>

					<div className="info-card">
						<div className="icon"><FaMapMarkerAlt /></div>
						<div>
							<h3>Adresa</h3>
							<p>Str. Principală, nr.151, sat Gara Milișăuți, Suceava</p>
						</div>
					</div>

					<div className="socials">
						<a href="#" aria-label="Facebook"><FaFacebookF /></a>
						<a href="#" aria-label="Instagram"><FaInstagram /></a>
					</div>

					<div className="faq-block">
						<h3>Întrebări frecvente</h3>
						<ul className="faq-list">
							{faqs.map((f, i) => (
								<li key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
									<button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>{f.q}</button>
									<div className="faq-a">{f.a}</div>
								</li>
							))}
						</ul>
					</div>
				</aside>

				<main className="contact-main">
					<form className="contact-form" onSubmit={handleSubmit} noValidate>
						<h2>Trimite-ne un mesaj</h2>
						{sent && <div className="form-success">Mesaj trimis! Îți vom răspunde în curând.</div>}
						{serverError && <div className="form-error">{serverError}</div>}

						<label>
							Nume
							<input name="name" value={form.name} onChange={handleChange} />
							{errors.name && <div className="error">{errors.name}</div>}
						</label>

						<label>
							Email
							<input name="email" value={form.email} onChange={handleChange} />
							{errors.email && <div className="error">{errors.email}</div>}
						</label>

						<label>
							Telefon (opțional)
							<input name="phone" value={form.phone} onChange={handleChange} />
						</label>

						<label>
							Mesaj
							<textarea name="message" rows={5} value={form.message} onChange={handleChange} />
							{errors.message && <div className="error">{errors.message}</div>}
						</label>

						<div className="form-actions">
							<button type="submit" className="btn primary" disabled={loading}>
								{loading ? "Se trimite..." : "Trimite mesaj"}
							</button>
							<button type="button" className="btn ghost" onClick={() => setForm({ name: "", email: "", phone: "", message: "" })} disabled={loading}>Resetează</button>
						</div>
					</form>

					<div className="map-wrap">
						<h3>Unde ne găsești</h3>
												{/* Exemplu iframe Google Maps - înlocuiește coordonatele cu locația reală */}
												<div style={{ width: "100%" }}>
													<iframe
														width="720"
														height="600"
														frameBorder="0"
														scrolling="no"
														marginHeight={0}
														marginWidth={0}
														src="https://maps.google.com/maps?width=720&amp;height=600&amp;hl=en&amp;q=AGRORUS%20BRAND%20S.R.L.+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
														title="Hanwo Location"
													/>
												</div>
					</div>
				</main>
			</div>

			<section className="contact-note">
				<h4>Menține informațiile actualizate</h4>
				<p>Ne asigurăm că datele de contact sunt actualizate. Dacă observi o informație incorectă, scrie-ne și o vom corecta imediat.</p>
			</section>
		</div>
	);
}

