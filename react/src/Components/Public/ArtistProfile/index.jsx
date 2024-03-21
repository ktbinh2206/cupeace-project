import { useEffect } from "react"
import { useParams } from "react-router"
import axiosClient from "../../../axios"

export default function ArtistProfile() {

  const { id } = useParams()
  useEffect(() => {
    axiosClient
      .get('/artist/profile?id=' + id)
      .then((data) => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <>
    </>
  )
};
