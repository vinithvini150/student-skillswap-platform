import {
  Download,
  Laptop,
  MonitorDown,
  ShieldCheck,
  Smartphone
} from "lucide-react";

function Downloads() {
  const downloads = [
    {
      title: "Windows 64-bit",
      description: "For most modern Windows 10 and Windows 11 computers.",
      file: "/downloads/Student-SkillSwap-Windows-x64.exe",
      icon: <Laptop size={34} />,
      buttonText: "Download for Windows x64"
    },
    {
      title: "Windows 32-bit",
      description: "For older 32-bit Windows computers.",
      file: "/downloads/Student-SkillSwap-Windows-x32.exe",
      icon: <MonitorDown size={34} />,
      buttonText: "Download for Windows x32"
    },
    {
      title: "Android APK",
      description: "Install on Android phones and tablets.",
      file: "/downloads/Student-SkillSwap-Android.apk",
      icon: <Smartphone size={34} />,
      buttonText: "Download Android APK"
    }
  ];

  return (
    <main className="page-container">
      <section className="page-heading">
        <p className="eyebrow">SkillSwap Apps</p>
        <h1>Download Student SkillSwap.</h1>
        <p>
          Use SkillSwap on your Windows computer or Android phone.
        </p>
      </section>

      <section className="download-grid">
        {downloads.map((app) => (
          <article className="download-card" key={app.title}>
            <div className="download-icon">{app.icon}</div>

            <h2>{app.title}</h2>
            <p>{app.description}</p>

            <a
              href={app.file}
              className="download-button"
              download
            >
              <Download size={18} />
              {app.buttonText}
            </a>
          </article>
        ))}
      </section>

      <section className="download-info-card">
        <ShieldCheck size={24} />
        <div>
          <h2>Installation note</h2>
          <p>
            Windows may show a security warning for a newly created app.
            Choose “More info” and then “Run anyway” only if you downloaded
            the installer from your own official SkillSwap website.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Downloads;