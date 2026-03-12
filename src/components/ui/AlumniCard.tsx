interface AlumniCardProps {
  name: string,
  photoUrl?: string,
  school?: {
    element?: {
      name: string,
      graduation: number
    },
    middle?: {
      name: string,
      graduation: number
    },
    high?: {
      name: string,
      graduation: number
    }
  },
  region?: string,
  email?: string,
  phone?: string
}

function AlumniCard({ name, photoUrl, school, region, email, phone }: AlumniCardProps) {
  return (
    <article>
      <div style={{width:'30px'}}>
        <img src={photoUrl} className="alumni-card__photo"/>
      </div>
      <div>{name}</div>
      <p>{school?.element?.name} {school?.element?.graduation}</p>
      <p>{school?.middle?.name} {school?.middle?.graduation}</p>
      <p>{school?.high?.name} {school?.high?.graduation}</p>

      <div>
        <div> {name} </div>
        <div> {region} </div>
        <div> {phone} </div>
        <div> {email} </div>
        <div> {school?.element?.name} {school?.element?.graduation} </div>
        <div> {school?.middle?.name} {school?.middle?.graduation} </div>
        <div> {school?.high?.name} {school?.high?.graduation} </div>
      </div>
    </article>
  )
}

export default AlumniCard;
