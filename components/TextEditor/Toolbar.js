import { AlignLeft } from './Icons/AlignLeft';
import { AlignCenter } from './Icons/AlignCenter';
import { AlignRight } from './Icons/AlignRight';
import { BulletList } from './Icons/BulletList';
import { NumberList } from './Icons/NumberList';
import { Quote } from './Icons/Quote';
import { Undo } from './Icons/Undo';
import { Redo } from './Icons/Redo';
import { HorizontalRule } from './Icons/HorizontalRule';
import { ClearFormatting } from './Icons/ClearFormatting';
import { Reset } from './Icons/Reset';
import { PageBreak } from './Icons/PageBreak';
import LinkButton from './LinkButton';
import ImageUpload from './ImageUpload';
import TextSelect from './TextSelect';
import VideoEmbedCodeUpload from './VideoEmbedCodeUpload';

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div
      className={`tiptap-toolbar border text-gray-700 ${
        editor.isFocused ? 'border-gray-500' : ' border-gray-300'
      }`}
    >
      <TextSelect editor={editor} />

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        title='Bold'
      >
        <b>B</b>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        title='Italic'
      >
        <i className='font-serif'>I</i>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'is-active' : ''}
        title='Underline'
      >
        <span className='underline underline-offset-2'>U</span>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        title='Align left'
      >
        <span className='fill-gray-700'>
          <AlignLeft />
        </span>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
        title='Align center'
      >
        <span className='fill-gray-700'>
          <AlignCenter />
        </span>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        title='Align right'
      >
        <span className='fill-gray-700'>
          <AlignRight />
        </span>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title='Clear formatting'
      >
        <span className='fill-gray-700'>
          <ClearFormatting />
        </span>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        title='Bullet list'
      >
        <span className='fill-gray-700'>
          <BulletList />
        </span>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        title='Ordered list'
      >
        <span className='fill-gray-700'>
          <NumberList />
        </span>
      </button>

      <ImageUpload editor={editor} />

      <VideoEmbedCodeUpload editor={editor} />

      <LinkButton editor={editor} />

      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
        title='Blockquote'
      >
        <span className='fill-gray-700'>
          <Quote />
        </span>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title='Horizontal rule'
      >
        <span className='fill-gray-700'>
          <HorizontalRule />
        </span>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().setHardBreak().run()}
        title='Page break'
      >
        <span className='fill-gray-700'>
          <PageBreak />
        </span>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title='Undo'
      >
        <span className='fill-gray-700'>
          <Undo />
        </span>
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title='Redo'
      >
        <span className='fill-gray-700'>
          <Redo />
        </span>
      </button>

      <button
        type='button'
        onClick={() => editor.chain().focus().clearContent(true).run()}
        disabled={!editor.can().chain().focus().clearContent().run()}
        title='Reset'
      >
        <span className='fill-gray-700'>
          <Reset />
        </span>
      </button>
    </div>
  );
};

export default Toolbar;
