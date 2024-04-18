export default function PhotoGallery({ arts ,addBid}) {

  const onSubmit=(e)=>{
    e.preventDefault();
    const bidName = e.target.bidName.value;
    const bidAmount = e.target.bidAmount.value;
    addBid(arts._id,bidName,bidAmount);
  }
  return (
    <div className="photo-container">
      <div className="photo">
        <img src={arts.src} alt="" width="200" />
      </div>
      <div className="comments-section">
        <div>
          <h4>Bids</h4>
          <ul>
            {arts.bids.map((bida) => (
              <li>
                <strong>{bida.user}</strong> ${bida.bid}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="addbid">
        <form className="comment-form" onSubmit={onSubmit}>
          <input name="bidName" type="text" placeholder="Your name" />
          <input name="bidAmount" ype="number" placeholder="Add a higher bid" />
          <button type="submit" >Submit Your Higher Bid</button>
        </form>
      </div>
    </div>
  );
}
