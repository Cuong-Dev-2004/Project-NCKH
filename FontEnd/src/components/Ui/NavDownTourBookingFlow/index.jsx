function NavDown({ data, type }) {
    return (
        <form className="max-w-sm min-w-[150px] mx-5">
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {type}
            </p>
            <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
                <option value="">{type}</option>
                {data.map((item, index) => (
                    <option value={item} key={index}>
                        {item}
                    </option>
                ))}
            </select>
        </form>
    );
}

export default NavDown;
