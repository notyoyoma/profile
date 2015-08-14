require 'open-uri'
require 'nokogiri'
require 'nokogiri-styles'
require 'pry'

def node_index node
  node.xpath("../#{node.name}").index(node)
end

def type_from_index t, i
  t.css('tr')[1].css('th')[i].css('a').first[:title].downcase
end
def index_from_type t, type

end

typeWiki = 'http://bulbapedia.bulbagarden.net/wiki/Type/Type_chart'
pTypeHtml = Nokogiri::HTML(open(typeWiki))

$typeTables = {
  :gen1 => pTypeHtml.css('table.roundy')[1],
  :gen2 => pTypeHtml.css('table.roundy')[0],
}

$typeObject = {}

$typeTables.each do |k,t|
  curgen = {}
  curgen[:name] = t.css('tr').last.text.gsub(/[\n\.]/, "")[/Generation.*/].gsub(/eration/, "")

  curgen[:types] = {}
  t.css('tr')[1].css('th').each {|th|
    name = th.css('a').first[:title].downcase
    curgen[:types][name] = {
      color: th.styles['background']
    }
  }

  type_count = curgen[:types].count-1

  (0..type_count).each do |i|
    type = type_from_index t, i
    curgen[:types][type][:attack] = {
      strong:   t.css('tr')[i+2].css('td').reject {|td| td.text.strip != "2×"}.collect {|td| type_from_index(t, node_index(td)) },
      weak:     t.css('tr')[i+2].css('td').reject {|td| td.text.strip != "½×"}.collect {|td| type_from_index(t, node_index(td)) },
      noeffect: t.css('tr')[i+2].css('td').reject {|td| td.text.strip != "0×"}.collect {|td| type_from_index(t, node_index(td)) },
    }
    curgen[:types][type][:defence] = {
      strong:   t.css('tr')[2..type_count+2].collect {|tr| tr.css('td')[i]}.reject {|td| td.text.strip != "½×"}.collect {|td| type_from_index(t, node_index(td.xpath(".."))-2) },
      weak:     t.css('tr')[2..type_count+2].collect {|tr| tr.css('td')[i]}.reject {|td| td.text.strip != "2×"}.collect {|td| type_from_index(t, node_index(td.xpath(".."))-2) },
      noeffect: t.css('tr')[2..type_count+2].collect {|tr| tr.css('td')[i]}.reject {|td| td.text.strip != "0×"}.collect {|td| type_from_index(t, node_index(td.xpath(".."))-2) },
    }

  end
  
  
  $typeObject[k] = curgen
end
