
type ImageInfo = {
    width: number;
    height: number;
    alt: string;
    heading: string;
}

export default function ImageDisplay({image,source}: {image: ImageInfo,source: string}){
    return(
        <div className="basis-1/2 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-3 mr-3 justify-center">

            {source ? (
              <img
                src={source}
                width={image.width}
                height={image.height}
                alt={image.alt}
              />
            ) : (
              <p>Loading Image...</p>
            )}
            <h1 className="text-lg my-2 font-inter italic font-semibold border-b-2 border-[#E9EAEB]">{image.heading}</h1>
            
        </div>
    )
}