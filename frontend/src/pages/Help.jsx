import { ChevronDown, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [successMessage, setSuccessMessage] = useState("");

  const faqs = [
    {
      question: "How do I send a skill-learning request?",
      answer:
        "Open Find Students, search for a skill, choose a student, and click Request to learn."
    },
    {
      question: "How do I accept a request?",
      answer:
        "Log in as the student who can teach the skill. Open Requests and use the Accept button under Requests received."
    },
    {
      question: "Where can I see scheduled classes?",
      answer:
        "Scheduled classes will appear in the Calendar section after a teacher accepts a request and creates a class schedule."
    },
    {
      question: "Can I change dark mode?",
      answer:
        "Yes. Use the moon icon in the navigation bar or open Settings."
    }
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSuccessMessage(
      "Your message has been saved. We will get back to you soon."
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });

    window.setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  };

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">Help & Contact</p>
        <h1>How can we help you?</h1>
        <p>Find answers or send a message to the SkillSwap support team.</p>
      </section>

      <section className="help-grid">
        <div className="faq-card">
          <div className="help-card-heading">
            <MessageCircle size={24} />

            <div>
              <h2>Frequently asked questions</h2>
              <p>Quick answers about using SkillSwap.</p>
            </div>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article className="faq-item" key={faq.question}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>

                  <ChevronDown
                    size={19}
                    className={
                      openFaq === index ? "faq-arrow open" : "faq-arrow"
                    }
                  />
                </button>

                {openFaq === index && (
                  <p className="faq-answer">{faq.answer}</p>
                )}
              </article>
            ))}
          </div>
        </div>

        <section className="contact-card">
          <div className="help-card-heading">
            <Mail size={24} />

            <div>
              <h2>Contact support</h2>
              <p>Send your question, feedback, or issue.</p>
            </div>
          </div>

          {successMessage && (
            <p className="form-success">{successMessage}</p>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Your name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Subject
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Example: Request issue"
                required
              />
            </label>

            <label>
              Message
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Explain your question or issue..."
                rows="5"
                required
              />
            </label>

            <button type="submit" className="save-button">
              <Send size={18} />
              Send message
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

export default Help;