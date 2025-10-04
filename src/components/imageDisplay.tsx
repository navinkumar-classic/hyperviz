
type ImageInfo = {
    width: number;
    height: number;
    alt: string;
    heading: string;
}

export default function ImageDisplay({image,source}: {image: ImageInfo,source: string}){
    return(
        <div className="w-full lg:basis-1/2 flex flex-col items-center bg-white border-1 border-[#E9EAEB] rounded-lg p-2 sm:p-3 lg:mr-3 justify-center">

            {source ? (
              <img
                src={source}
                width={image.width}
                height={image.height}
                alt={image.alt}
                className="max-w-full h-auto"
              />
            ) : (
              <p className="text-sm sm:text-base">Loading Image...</p>
            )}
            <h1 className="text-sm sm:text-base lg:text-lg my-2 font-inter italic font-semibold border-b-2 border-[#E9EAEB] text-center">{image.heading}</h1>
            
        </div>
    )
}