import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import companyService from '../services/companyService.js';
import '../css/DMDraftPrompt.css';

/* ── Toolbar button ── */
function ToolbarBtn({ onClick, active, title, children }) {
    return (
        <button
            type="button"
            className={`toolbar-btn${active ? ' is-active' : ''}`}
            onClick={onClick}
            title={title}
        >
            {children}
        </button>
    );
}

/* ── Toolbar ── */
function EditorToolbar({ editor }) {
    if (!editor) return null;

    return (
        <div className="editor-toolbar">
            <ToolbarBtn
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
                title="Bold"
            ><strong>B</strong></ToolbarBtn>

            <ToolbarBtn
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
                title="Italic"
            ><em>I</em></ToolbarBtn>

            <ToolbarBtn
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                active={editor.isActive('underline')}
                title="Underline"
            ><span style={{ textDecoration: 'underline' }}>U</span></ToolbarBtn>

            <div className="toolbar-divider" />

            <ToolbarBtn
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive('bulletList')}
                title="Bullet list"
            >≡</ToolbarBtn>

            <ToolbarBtn
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive('orderedList')}
                title="Numbered list"
            >1.</ToolbarBtn>

            <div className="toolbar-divider" />

            <ToolbarBtn
                onClick={() => {
                    const url = window.prompt('Enter URL:');
                    if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
                active={editor.isActive('link')}
                title="Insert link"
            >🔗</ToolbarBtn>

            <ToolbarBtn
                onClick={() => editor.chain().focus().unsetLink().run()}
                active={false}
                title="Remove link"
            >✂️</ToolbarBtn>

            <div className="toolbar-divider" />

            <ToolbarBtn
                onClick={() => editor.chain().focus().undo().run()}
                title="Undo"
            >↩</ToolbarBtn>

            <ToolbarBtn
                onClick={() => editor.chain().focus().redo().run()}
                title="Redo"
            >↪</ToolbarBtn>
        </div>
    );
}

/* ── Main component ── */
export default function DMDraftPrompt({ companyId, companyName }) {
    const [platform, setPlatform] = useState('X');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder: 'Draft will appear here after generation…' }),
        ],
        content: '',
    });

    const generateDraft = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await companyService.generateDraft(companyId, platform);
            // Insert the generated plain text as a paragraph block
            editor.commands.setContent(
                data.draft_text.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('')
            );
        } catch (err) {
            setError({
                message: err.message,
                details: err.data
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        // Copy plain text (strip HTML tags)
        const text = editor.getText({ blockSeparator: '\n' });
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="dm-draft-prompt">
            <h3>✉️ Draft Outreach DM</h3>
            <p className="dm-subtitle">
                Draft a personal outreach message to offer your services to this company.
            </p>

            <div className="dm-controls">
                <label htmlFor={`platform-${companyId}`}>Platform:</label>
                <select
                    id={`platform-${companyId}`}
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                >
                    <option value="X">𝕏 X / Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                </select>
                <button className="btn-generate" onClick={generateDraft} disabled={loading}>
                    {loading ? 'Generating…' : '⚡ Generate DM'}
                </button>
            </div>

            {error && (
                <div className="dm-error">
                    <p>⚠️ {error.message}</p>
                    {error.details && (
                        <details>
                            <summary>View details</summary>
                            <pre>{JSON.stringify(error.details, null, 2)}</pre>
                        </details>
                    )}
                </div>
            )}

            {/* WYSIWYG Editor */}
            <div className="dm-editor-wrapper">
                <EditorToolbar editor={editor} />
                <EditorContent editor={editor} className="dm-editor" />
            </div>

            <div className="dm-actions">
                <button className="btn-copy" onClick={copyToClipboard}>
                    {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
                </button>
                <button
                    className="btn-send"
                    onClick={() => alert(`🚀 Dummy Action: DM would be sent to ${companyName}'s ${platform} profile!`)}
                    disabled={!editor || editor.isEmpty}
                >
                    📫 Send DM
                </button>
            </div>
        </div>
    );
}
