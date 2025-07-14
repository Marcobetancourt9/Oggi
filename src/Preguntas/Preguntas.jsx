import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaGlasses, FaEye, FaQuestionCircle } from 'react-icons/fa';
import './Preguntas.css';

const Preguntas = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const categorias = [
    {
      id: 'lentes',
      nombre: 'Lentes Ópticos',
      icono: <FaGlasses />,
      preguntas: [
        {
          pregunta: "¿Cómo sé qué tipo de lentes necesito?",
          respuesta: "El tipo de lentes depende de tu graduación y necesidades visuales. Nuestros oftalmólogos realizarán un examen completo para determinar si necesitas lentes monofocales, bifocales o progresivos."
        },
        {
          pregunta: "¿Cuánto tiempo tarda en adaptarse a los nuevos lentes?",
          respuesta: "El período de adaptación varía entre 1-2 semanas. Puedes experimentar leve mareo o distorsión inicial que desaparecerá conforme tus ojos se ajusten."
        },
        {
          pregunta: "¿Los lentes con antirreflejo valen la pena?",
          respuesta: "Sí, los tratamientos antirreflejo reducen los reflejos molestos, mejoran la estética y disminuyen la fatiga visual, especialmente para quienes pasan mucho tiempo frente a pantallas."
        }
      ]
    },
    {
      id: 'contacto',
      nombre: 'Lentes de Contacto',
      icono: <FaEye />,
      preguntas: [
        {
          pregunta: "¿Puedo dormir con lentes de contacto?",
          respuesta: "Solo si son lentes de uso prolongado específicamente diseñados para ello. La mayoría de lentes de contacto no deben usarse al dormir ya que aumentan el riesgo de infecciones."
        },
        {
          pregunta: "¿Cómo sé si mis lentes de contacto están al revés?",
          respuesta: "Coloca el lente sobre tu dedo y obsérvalo de perfil. Si los bordes se curvan hacia afuera está al revés. Si forman una 'U' perfecta, está en la posición correcta."
        },
        {
          pregunta: "¿Puedo nadar con lentes de contacto?",
          respuesta: "No es recomendable. El agua puede contener microorganismos que se adhieren a los lentes. Si necesitas corrección visual para nadar, usa lentes desechables diarios con gafas de natación."
        }
      ]
    },
    {
      id: 'monturas',
      nombre: 'Monturas',
      icono: <FaGlasses />,
      preguntas: [
        {
          pregunta: "¿Cómo elijo la montura adecuada para mi rostro?",
          respuesta: "Las monturas deben complementar la forma de tu rostro. Ovaladas para caras cuadradas, angulares para rostros redondos. Nuestros optometristas pueden asesorarte para encontrar el estilo que mejor se adapte a ti."
        },
        {
          pregunta: "¿Las monturas de metal son mejores que las de acetato?",
          respuesta: "Depende de tus necesidades. El metal es más resistente pero puede causar alergias. El acetato es hipoalergénico, liviano y ofrece más variedad de colores. Ambas son excelentes opciones."
        },
        {
          pregunta: "¿Con qué frecuencia debo cambiar mis monturas?",
          respuesta: "Recomendamos cambiar las monturas cada 2-3 años o si notas que están deformadas, dañadas o ya no te resultan cómodas. Los niños pueden necesitar cambios más frecuentes por crecimiento."
        }
      ]
    },
    {
      id: 'general',
      nombre: 'Preguntas Generales',
      icono: <FaQuestionCircle />,
      preguntas: [
        {
          pregunta: "¿Cada cuánto debo revisar mi vista?",
          respuesta: "Adultos deberían realizarse un examen anual. Niños cada 6-12 meses. Personas con diabetes o historial familiar de enfermedades oculares pueden necesitar controles más frecuentes."
        },
        {
          pregunta: "¿Los lentes pueden prevenir el aumento de miopía?",
          respuesta: "Existen lentes especiales con tecnología de desenfoque periférico que pueden ayudar a controlar la progresión de la miopía en niños y adolescentes. Consulta con nuestro especialista."
        },
        {
          pregunta: "¿Qué hago si mis lentes se empañan con la mascarilla?",
          respuesta: "Ajusta bien la mascarilla en el puente nasal, usa productos antiempañantes o la técnica de lavar los lentes con jabón neutro y secar al aire. También tenemos tratamientos especiales antiempañantes."
        }
      ]
    }
  ];

  const toggleCategory = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const toggleQuestion = (questionIndex) => {
    setExpandedQuestion(expandedQuestion === questionIndex ? null : questionIndex);
  };

  return (
    <div className="preguntas-container">
      <div className="preguntas-header">
        <h1>Preguntas Frecuentes</h1>
        <p>Encuentra respuestas a las dudas más comunes sobre salud visual</p>
      </div>

      <div className="categorias-container">
        {categorias.map((categoria) => (
          <div 
            key={categoria.id} 
            className={`categoria-card ${activeCategory === categoria.id ? 'active' : ''}`}
          >
            <div 
              className="categoria-header"
              onClick={() => toggleCategory(categoria.id)}
            >
              <div className="categoria-icon">
                {categoria.icono}
              </div>
              <h2>{categoria.nombre}</h2>
              <span className="toggle-icon">
                {activeCategory === categoria.id ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {activeCategory === categoria.id && (
              <div className="preguntas-list">
                {categoria.preguntas.map((item, index) => (
                  <div 
                    key={index} 
                    className="pregunta-item"
                    onClick={() => toggleQuestion(index)}
                  >
                    <div className="pregunta-header">
                      <h3>{item.pregunta}</h3>
                      <span>
                        {expandedQuestion === index ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                    </div>
                    {expandedQuestion === index && (
                      <div className="pregunta-respuesta">
                        <p>{item.respuesta}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="preguntas-cta">
        <h3>¿No encontraste tu respuesta?</h3>
        <p>Nuestros especialistas están listos para ayudarte</p>
        <button className="cta-button">Contactar a un especialista</button>
      </div>
    </div>
  );
};

export default Preguntas;