// Renders text as plain paragraphs. We never use dangerouslySetInnerHTML,
// so a blog post can not run scripts in a visitor's browser.
export default function PostBody({ content }) {
  return (
    <div className="prose">
      {content.split(/\n{2,}/).map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}
