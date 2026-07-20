#!/usr/bin/env bash
# Generates a soft, synthesized instrumental placeholder bed at
# public/audio/music.mp3 using nothing but ffmpeg's built-in signal
# generators. This is explicitly a PLACEHOLDER — a simple warm pad, not a
# licensed acoustic-guitar/country track. It exists only so the project has
# *something* under the narration while previewing/rendering.
#
# Before final delivery, replace public/audio/music.mp3 with a real
# licensed or royalty-free soft-instrumental-country track (acoustic
# guitar, light percussion, warm bass, subtle steel guitar) per the
# creative brief. Do not present this placeholder as licensed music.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=public/audio/music.mp3
DURATION=155

# Three soft, slightly-detuned sine layers (a gentle triad) with a slow
# amplitude swell, standing in for a warm ambient pad. No drums, no lead,
# nothing that competes with narration.
ffmpeg -y \
  -f lavfi -i "sine=frequency=130.81:duration=${DURATION}" \
  -f lavfi -i "sine=frequency=164.81:duration=${DURATION}" \
  -f lavfi -i "sine=frequency=196.00:duration=${DURATION}" \
  -filter_complex "\
    [0:a]volume=0.05,afade=t=in:st=0:d=6,afade=t=out:st=$((DURATION-6)):d=6[a0]; \
    [1:a]volume=0.04,afade=t=in:st=0:d=6,afade=t=out:st=$((DURATION-6)):d=6[a1]; \
    [2:a]volume=0.035,afade=t=in:st=0:d=6,afade=t=out:st=$((DURATION-6)):d=6[a2]; \
    [a0][a1][a2]amix=inputs=3:normalize=0,lowpass=f=1200[out]" \
  -map "[out]" -ar 44100 -b:a 160k "$OUT"

echo "Wrote placeholder ambient bed to $OUT"
echo "Reminder: this is a synthesized placeholder, not licensed country music."
