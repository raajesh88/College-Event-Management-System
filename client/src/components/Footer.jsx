import React from 'react';
import { Calendar, Mail, Phone, MapPin, Globe, Share2, MessageCircle, Send, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Brand column */}
        <div className="footer-col brand-col">
          <div className="brand-logo">
            <div className="brand-icon-wrapper">
              <Calendar className="brand-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-title">CampusEvents</span>
              <span className="brand-subtitle">College Event Hub</span>
            </div>
          </div>
          <p className="footer-desc">
            Empowering college communities to discover, organize, collaborate, and excel through
            seamless campus event management.
          </p>
          <div className="social-links">
            <a href="#social" aria-label="Campus Radio" className="social-icon" title="Broadcasts">
              <Radio size={18} />
            </a>
            <a href="#social" aria-label="Campus Network" className="social-icon" title="Community">
              <Share2 size={18} />
            </a>
            <a href="#social" aria-label="Campus Forums" className="social-icon" title="Discussions">
              <MessageCircle size={18} />
            </a>
            <a href="#social" aria-label="Announcements" className="social-icon" title="Telegram Channel">
              <Send size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Navigation</h4>
          <ul className="footer-list">
            <li><Link to="/">Home</Link></li>
            <li><a href="#about">About System</a></li>
            <li><a href="#events">Upcoming Events</a></li>
            <li><a href="#features">Key Features</a></li>
            <li><Link to="/login">Account Login</Link></li>
            <li><Link to="/signup">Register Account</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4 className="footer-heading">Event Categories</h4>
          <ul className="footer-list">
            <li><a href="#events">Hackathons & Coding</a></li>
            <li><a href="#events">Technical Symposiums</a></li>
            <li><a href="#events">Cultural Fests & Arts</a></li>
            <li><a href="#events">Workshops & Seminars</a></li>
            <li><a href="#events">Sports Tournaments</a></li>
            <li><a href="#events">Leadership & Summits</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col" id="contact">
          <h4 className="footer-heading">Contact Us</h4>
          <ul className="footer-contact-list">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>Campus Student Affairs & Innovation Center, University Campus</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>events@campusevents.edu</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+1 (555) 482-9012 / Ext: 304</span>
            </li>
            <li>
              <Globe size={18} className="contact-icon" />
              <span>www.campusevents.edu</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© {new Date().getFullYear()} College Event Management System. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#campus">Campus Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
