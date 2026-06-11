const FOLDER_MAP = {
  doodle:  'Doodles',
  digital: 'Digital',
};

export async function onRequestGet({ params, env }) {
  const folder = FOLDER_MAP[params.tab];
  if (!folder) {
    return new Response(JSON.stringify({ error: 'Unknown tab' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const credentials = btoa(`${env.API_KEY}:${env.API_SECRET}`);
  const url = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/resources/search`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      expression: `folder:${folder}`,
      sort_by: [{ public_id: 'desc' }],
      max_results: 100,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: text }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await res.json();
  const images = data.resources.map(r => ({
    src: r.secure_url,
    alt: r.public_id,
  }));

  return new Response(JSON.stringify(images), {
    headers: { 'Content-Type': 'application/json' },
  });
}
