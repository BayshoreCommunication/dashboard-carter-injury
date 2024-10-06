import { useState, useCallback } from 'react';
import { LinkIcon } from './Icons/LinkIcon';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { RadioField } from '../FormFields/RadioField';
import Button from '../ui/Button';
import { VideoIcon } from './Icons/VideoIcon';

function VideoEmbedCodeUpload({ editor }) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [url, setUrl] = useState(editor?.getAttributes('link').href || '');

  const handleButtonClick = () => {
    setShowLinkModal(!showLinkModal);
    setUrl(editor?.getAttributes('link').href);
  };

  const handleAddLink = () => {
    if (!url) return;

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 560,
        height: 315,
      });
    }

    setShowLinkModal(false);
    setUrl('');
  };

  return (
    <Dialog open={showLinkModal} onOpenChange={setShowLinkModal}>
      <DialogTrigger asChild>
        <button
          type='button'
          className={
            showLinkModal || editor?.isActive('link') ? 'is-active' : ''
          }
          onClick={handleButtonClick}
          title='Link'
        >
          <span className='fill-gray-700'>
            <VideoIcon />
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className='px-[35px] py-[40px] relative bg-white  border border-gray-300 w-[644px] rounded-lg'>
        <form className='w-full'>
          <label htmlFor='url' className='font-medium'>
            URL:
          </label>
          <input
            id='url'
            type='url'
            placeholder='Enter URL'
            className='mt-2 p-3 w-full outline-none bg-white rounded-md border border-custom-gray2 focus:border-gray-700'
            name='url'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            autoComplete='off'
            required
          />

          {/* <div className='mt-4 flex justify-between items-center'>
            <div className='space-y-3'>
              <RadioField
                label='Left'
                name='targetOptions'
                checked={alignment === 'left'}
                onChange={() => setAlignment('left')}
              />
              <RadioField
                label='Center'
                name='targetOptions'
                checked={alignment === 'center'}
                onChange={() => setAlignment('center')}
              />
              <RadioField
                label='Right'
                name='targetOptions'
                checked={alignment === 'right'}
                onChange={() => setAlignment('right')}
              />
            </div>
          </div> */}
          <div className='mt-3 flex justify-center'>
            <Button type='submit' className='w-[150px]' onClick={handleAddLink}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default VideoEmbedCodeUpload;
