import React from "react";
import "./About.css";
import desprenoi from "../assets/images/desprenoi.jpg";
import desprenoi1 from "../assets/images/desprenoi1.jpg";
import persoana from "../assets/images/Agrorus-logo.png";

export default function About() {
  return (
    <div className="about-page">
      {/* === SECTIUNEA 1 (IMAGINE STÂNGA / TEXT DREAPTA) === */}
      <section className="about-section reverse">
        <div className="about-image">
          <img src={desprenoi} alt="Despre HANWO" />
        </div>

        <div className="about-text">
          <h2>Despre HANWO</h2>
          <p>
            HANWO este o companie cu o istorie de peste 30 de ani în proiectarea
            și producția de echipamente agricole moderne, având origini în China
            și o prezență tot mai extinsă pe piețele internaționale.
          </p>
          <p>
            Produsele noastre principale includ tractoare agricole între 30 și
            300 de cai putere, combine pentru recoltarea cerealelor și diverse
            utilaje agricole destinate cultivării eficiente a terenurilor. Prin
            combinarea experienței, tehnologiei și inovației continue, HANWO
            oferă soluții fiabile și durabile pentru fermierii din întreaga
            lume.
          </p>
          <p>
            Capacitatea noastră de a răspunde cerințelor complexe ale pieței,
            alături de angajamentul față de calitate și performanță, ne-a permis
            să devenim un partener de încredere pentru clienți din peste 20 de
            țări, contribuind la dezvoltarea mecanizării agricole la nivel
            global.
          </p>
        </div>
      </section>

  {/* === SECTIUNEA 2 (IMAGINE STÂNGA / TEXT DREAPTA) - inversat === */}
  <section className="about-section reverse">
        <div className="about-text">
          <p>
            Am creat echipamente agricole care îmbină un aspect plăcut,
            funcționalități avansate și valoare accesibilă pentru a vă oferi o
            experiență diversă și pozitivă.
          </p>
          <p>
            Vă aducem produse de top pe piață, precum și soluții și servicii
            pentru producția agricolă, pentru a vă îmbunătăți eficiența
            operațională.
          </p>
          <p>
            Vă facem viața mai ușoară. Vă oferim liniște sufletească. Suntem
            aici pentru a vă ajuta să faceți față provocărilor.
          </p>
          <p>Facem acest lucru pentru clienții noștri de peste 30 de ani.</p>
          <p>
            <strong>Da, aceasta este HANWO.</strong>
          </p>
        </div>

        <div className="about-image">
          <img src={desprenoi1} alt="HANWO echipamente" />
        </div>
      </section>

      {/* === SECTIUNEA ROSIE CU ICONITE === */}
      <section className="about-highlight-container">
        <div className="about-highlight">
          <div className="highlight-item">
            <div className="icon">
              <i className="fas fa-cogs"></i>
            </div>
            <p>
              HANWO inovează și produce echipamente agricole excelente, conform
              nevoilor agriculturii moderne.
            </p>
          </div>

          <div className="highlight-item">
            <div className="icon">
              <i className="fas fa-lightbulb"></i>
            </div>
            <p>
              Prin inovație continuă și îmbunătățirea calității, conducem
              dezvoltarea sustenabilă a companiei.
            </p>
          </div>
        </div>
      </section>

      {/* === SECTIUNEA CHAIRMAN’S SPEECH (CU PĂTRAT ROȘU ÎN SPATE) === */}
      <section className="chairman-section">
        <div className="chairman-container">
          <div className="chairman-text">
            <h2>Despre Agrorus</h2>
            <p>
              Agrorus s-a născut din pasiunea pentru agricultură 
              și dorința de a oferi fermierilor soluții de încredere.
              Ne-am dorit să fim mai mult decât un simplu furnizor de utilaje,
              ci un partener de încredere pentru cei care muncesc pământul.
            </p>
            <p>
              Am început modest, cu motocultoare și piese de schimb,
              răspunzând nevoilor esențiale ale agricultorilor.
              Pe măsură ce clienții ne-au acordat încredere,
              ne-am diversificat și am introdus utilaje pentru tractorase,
              iar mai târziu tractoare între 25 și 125 CP, robuste și fiabile,
              precum și o gamă variată de utilaje compatibile.
            </p>
            <p>
              Drumul a avut provocări,
              dar perseverența și sprijinul clienților ne-au făcut mai puternici.
              Astăzi, Agrorus este o companie recunoscută pentru calitate,
              cu o echipă de 20 de profesioniști dedicați, 
              uniți de viziunea de a fi aproape de agricultor 
              și de a construi relații bazate pe încredere.

            </p>
            <p>
              Fiecare client și fiecare colaborare reprezintă o oportunitate#
              de a demonstra seriozitate, inovație și respect pentru tradițiile
              agricole. 
              Privim spre viitor cu aceeași pasiune care ne-a ghidat de la început
            </p>
            <p>

            </p>
            <p>Vă mulțumim pentru atenție și sprijin!</p>

            <div className="chairman-signature">—Agrorus</div>
          </div>

          <div className="chairman-image-wrapper">
            <div className="image-bg"></div>
            <div className="chairman-image">
              <img src={persoana} alt="Președintele Hanwo" />
            </div>
          </div>
        </div>
      </section>

      {/* === SECTIUNEA INOVAȚIE (RESEARCH & OPEN INNOVATION) === */}
      <section className="innovation-section">
        <h2>Sistemul de Inovație HANWO</h2>
        <div className="innovation-container">
          <div className="innovation-item">
            <h3>Cercetare și Dezvoltare (R&D Design)</h3>
            <p>
              HANWO acordă o importanță deosebită inovației tehnologice și
              dezvoltării continue. Avem un centru modern de cercetare și
              dezvoltare care se concentrează pe proiectarea echipamentelor
              agricole de nouă generație, îmbinând performanța, durabilitatea și
              eficiența energetică.
            </p>
            <p>
              Echipa noastră de ingineri și specialiști în agricultură colaborează
              constant pentru a îmbunătăți designul mecanic, confortul operatorului
              și integrarea tehnologiilor inteligente. Prin combinarea experienței
              și a tehnologiei de vârf, oferim fermierilor soluții inovatoare și
              eficiente pentru o agricultură modernă.
            </p>
          </div>

          <div className="innovation-item">
            <h3>Inovație Deschisă (Open Innovation)</h3>
            <p>
              HANWO promovează o cultură a inovației deschise, colaborând cu
              universități, institute de cercetare și parteneri industriali din
              întreaga lume. Prin acest sistem, accelerăm dezvoltarea de noi
              produse și tehnologii care răspund cerințelor tot mai complexe ale
              agriculturii moderne.
            </p>
            <p>
              Prin schimbul de cunoștințe și cooperarea internațională, HANWO
              contribuie activ la evoluția industriei agricole globale, aducând
              valoare adăugată clienților și partenerilor noștri. Scopul nostru
              este să construim împreună o agricultură mai sustenabilă, mai
              inteligentă și mai productivă.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
