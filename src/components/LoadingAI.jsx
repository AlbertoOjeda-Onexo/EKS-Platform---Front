// src/components/LoadingAI.jsx
import "../styles/Components/LoadingAI.css";

export default function LoadingAI() {
  return (
    <div className="loading-ai-overlay">
      <div className="loading-ai-container">
        <div className="robot">
          <div className="head">
            <div className="eyes">
              <div className="eye left" />
              <div className="eye right" />
            </div>
            <div className="antenna" />
          </div>
          <div className="body" />
        </div>
        <div className="loading-ai-text">La IA está generando una respuesta...</div>
      </div>
    </div>
  );
}
