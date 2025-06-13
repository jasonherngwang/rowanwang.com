import * as React from 'react';
import { SongViewer } from './song-viewer';
import { getSong } from '@/app/camelchords/utils/actions';
import { notFound } from 'next/navigation';

export default async function SongPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;

  const {
    id
  } = params;

  const songIdAsNumber = parseInt(id, 10);
  if (isNaN(songIdAsNumber)) {
    return notFound();
  }

  const result = await getSong(songIdAsNumber);

  if ("error" in result || !result.song) {
    return notFound();
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <SongViewer song={result.song} />
    </React.Suspense>
  );
}
